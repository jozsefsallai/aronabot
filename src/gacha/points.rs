use crate::db::enums::BannerKind;
use anyhow::Result;
use redis::AsyncCommands;

#[derive(Clone)]
pub struct RecruitmentPointsManager {
    client: Option<redis::aio::ConnectionManager>,
}

impl RecruitmentPointsManager {
    const GLOBAL_PREFIX: &'static str = "gacha";
    const JP_PREFIX: &'static str = "gacha_jp";

    pub async fn new(redis_url: Option<&str>) -> Result<Self> {
        let client = if let Some(url) = redis_url {
            let client = redis::Client::open(url)?;
            let manager = redis::aio::ConnectionManager::new(client).await?;
            Some(manager)
        } else {
            None
        };
        Ok(Self { client })
    }

    fn prefix(kind: BannerKind) -> &'static str {
        match kind {
            BannerKind::Global => Self::GLOBAL_PREFIX,
            BannerKind::JP => Self::JP_PREFIX,
        }
    }

    fn make_key(kind: BannerKind, guild_id: &str, user_id: &str) -> String {
        format!("{}:{}:{}", Self::prefix(kind), guild_id, user_id)
    }

    pub async fn get(
        &self,
        kind: BannerKind,
        guild_id: &str,
        user_id: &str,
    ) -> Result<Option<i64>> {
        let Some(mut conn) = self.client.clone() else {
            return Ok(None);
        };
        let key = Self::make_key(kind, guild_id, user_id);
        let points: Option<String> = conn.get(&key).await?;
        Ok(Some(
            points
                .and_then(|p| p.parse().ok())
                .unwrap_or(0),
        ))
    }

    pub async fn set(
        &self,
        kind: BannerKind,
        guild_id: &str,
        user_id: &str,
        points: i64,
    ) -> Result<()> {
        let Some(mut conn) = self.client.clone() else {
            return Ok(());
        };
        let key = Self::make_key(kind, guild_id, user_id);
        conn.set::<_, _, ()>(&key, points).await?;
        Ok(())
    }

    pub async fn increment_and_get(
        &self,
        kind: BannerKind,
        guild_id: &str,
        user_id: &str,
    ) -> Result<Option<i64>> {
        let Some(mut conn) = self.client.clone() else {
            return Ok(None);
        };
        let key = Self::make_key(kind, guild_id, user_id);
        let current: Option<String> = conn.get(&key).await?;
        let points = current.and_then(|p| p.parse::<i64>().ok()).unwrap_or(0) + 10;
        conn.set::<_, _, ()>(&key, points).await?;
        Ok(Some(points))
    }

    pub async fn reset_all(&self, kind: BannerKind) -> Result<bool> {
        let Some(mut conn) = self.client.clone() else {
            return Ok(false);
        };

        let pattern = format!("{}:*", Self::prefix(kind));
        let mut cursor: u64 = 0;

        loop {
            let (next, keys): (u64, Vec<String>) = redis::cmd("SCAN")
                .arg(cursor)
                .arg("MATCH")
                .arg(&pattern)
                .arg("COUNT")
                .arg(100)
                .query_async(&mut conn)
                .await?;

            for key in keys {
                conn.set::<_, _, ()>(&key, 0).await?;
            }

            cursor = next;
            if cursor == 0 {
                break;
            }
        }

        Ok(true)
    }

    pub fn is_available(&self) -> bool {
        self.client.is_some()
    }
}
