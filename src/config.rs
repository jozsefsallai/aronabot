use anyhow::{bail, Context, Result};

#[derive(Debug, Clone)]
pub struct Config {
    pub bot_token: String,
    pub bot_client_id: String,
    pub owner_id: String,
    pub staff_ids: Vec<String>,
    pub default_activity: Option<String>,
    pub is_maintenance: bool,
    pub database_url: String,
    pub redis_url: Option<String>,
    pub r2_public_access_url: Option<String>,
}

impl Config {
    pub fn from_env() -> Result<Self> {
        dotenvy::dotenv().ok();

        let bot_token = require_env("BOT_TOKEN")?;
        let bot_client_id = require_env("BOT_CLIENT_ID")?;
        let owner_id = require_env("OWNER_ID")?;
        let database_url = require_env("DATABASE_URL")?;

        let staff_ids = std::env::var("STAFF_IDS")
            .ok()
            .map(|s| {
                s.split(',')
                    .map(str::trim)
                    .filter(|s| !s.is_empty())
                    .map(ToOwned::to_owned)
                    .collect()
            })
            .unwrap_or_default();

        Ok(Self {
            bot_token,
            bot_client_id,
            owner_id,
            staff_ids,
            default_activity: std::env::var("BOT_DEFAULT_ACTIVITY").ok(),
            is_maintenance: std::env::var("IS_MAINTENANCE")
                .map(|v| v == "true")
                .unwrap_or(false),
            database_url,
            redis_url: std::env::var("REDIS_URL").ok(),
            r2_public_access_url: std::env::var("R2_PUBLIC_ACCESS_URL").ok(),
        })
    }

    pub fn is_staff(&self, user_id: &str) -> bool {
        self.owner_id == user_id || self.staff_ids.iter().any(|id| id == user_id)
    }

    pub fn portrait_url(&self, student_id: &str) -> String {
        let base = self
            .r2_public_access_url
            .as_deref()
            .unwrap_or("https://aronabot.cdn.nimblebun.works");
        format!("{base}/v2/images/students/portraits/{student_id}.png")
    }
}

fn require_env(key: &str) -> Result<String> {
    std::env::var(key).with_context(|| format!("Missing required environment variable: {key}"))
}

pub fn parse_user_id(id: &str) -> Result<u64> {
    id.parse::<u64>()
        .with_context(|| format!("Invalid Discord snowflake: {id}"))
}

pub fn ensure_snowflake(id: &str) -> Result<()> {
    if parse_user_id(id).is_err() {
        bail!("Invalid Discord snowflake: {id}");
    }
    Ok(())
}
