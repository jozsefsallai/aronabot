pub mod banners;
pub mod gifts;
pub mod missions;
pub mod students;

pub use banners::BannerContainer;
pub use gifts::GiftContainer;
pub use missions::MissionContainer;
pub use students::StudentContainer;

use crate::db;
use crate::gacha::banner::GachaBanner;
use anyhow::Result;
use sqlx::PgPool;
use tokio::sync::RwLock;

#[derive(Debug)]
pub struct Containers {
    pub students: RwLock<StudentContainer>,
    pub gifts: RwLock<GiftContainer>,
    pub missions: RwLock<MissionContainer>,
    pub banners: RwLock<BannerContainer>,
}

impl Containers {
    pub fn new() -> Self {
        Self {
            students: RwLock::new(StudentContainer::new()),
            gifts: RwLock::new(GiftContainer::new()),
            missions: RwLock::new(MissionContainer::new()),
            banners: RwLock::new(BannerContainer::new()),
        }
    }

    pub async fn bootstrap(&self, pool: &PgPool) -> Result<()> {
        self.reload(pool).await
    }

    pub async fn reload(&self, pool: &PgPool) -> Result<()> {
        tracing::info!("Loading containers from database...");

        let students = db::load_students(pool).await?;
        let gifts = db::load_gifts(pool).await?;
        let missions = db::load_missions(pool).await?;
        let banner_rows = db::load_banners(pool).await?;

        {
            let mut container = self.students.write().await;
            container.reload(students);
        }

        // Banners need student container for pool population
        let students_snapshot = {
            let container = self.students.read().await;
            container
                .get_students()
                .into_iter()
                .map(|s| s.student.clone())
                .collect::<Vec<_>>()
        };

        let banners: Vec<GachaBanner> = banner_rows
            .into_iter()
            .map(|row| GachaBanner::from_db_entry(row, &students_snapshot))
            .collect();

        self.gifts.write().await.reload(gifts);
        self.missions.write().await.reload(missions);
        self.banners.write().await.reload(banners);

        tracing::info!("Containers loaded.");
        Ok(())
    }
}

impl Default for Containers {
    fn default() -> Self {
        Self::new()
    }
}
