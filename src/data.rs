use crate::config::Config;
use crate::containers::Containers;
use crate::gacha::RecruitmentPointsManager;
use crate::render::GachaRenderer;
use sqlx::PgPool;
use std::sync::Arc;

pub struct Data {
    pub config: Config,
    pub pool: PgPool,
    pub containers: Arc<Containers>,
    pub points: RecruitmentPointsManager,
    pub renderer: GachaRenderer,
}

pub type Error = anyhow::Error;
pub type Context<'a> = poise::Context<'a, Data, Error>;
