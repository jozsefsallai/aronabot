#![allow(dead_code)]
#![allow(clippy::upper_case_acronyms)]
#![allow(clippy::needless_range_loop)]
#![allow(clippy::enum_variant_names)]

mod buttons;
mod commands;
mod config;
mod containers;
mod data;
mod db;
mod gacha;
mod handlers;
mod render;
mod utils;

use crate::config::Config;
use crate::containers::Containers;
use crate::data::Data;
use crate::gacha::RecruitmentPointsManager;
use crate::render::GachaRenderer;
use anyhow::Context as _;
use poise::serenity_prelude as serenity;
use serenity::all::{ActivityData, ClientBuilder, FullEvent, GatewayIntents};
use std::sync::Arc;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "aronabot=info,warn".into()),
        )
        .init();

    let config = Config::from_env()?;

    let pool = sqlx::postgres::PgPoolOptions::new()
        .max_connections(5)
        .connect(&config.database_url)
        .await
        .context("connect to postgres")?;

    let containers = Arc::new(Containers::new());
    containers.bootstrap(&pool).await?;

    let points = RecruitmentPointsManager::new(config.redis_url.as_deref()).await?;
    let renderer = GachaRenderer::new()?;

    let data = Data {
        config: config.clone(),
        pool,
        containers,
        points,
        renderer,
    };

    let intents = GatewayIntents::GUILDS
        | GatewayIntents::GUILD_MESSAGES
        | GatewayIntents::GUILD_MESSAGE_REACTIONS;

    let framework = poise::Framework::builder()
        .options(poise::FrameworkOptions {
            commands: commands::all_commands(),
            pre_command: |ctx| {
                Box::pin(async move {
                    tracing::debug!("Running command {}", ctx.command().qualified_name);
                })
            },
            command_check: Some(|ctx| {
                Box::pin(async move {
                    if ctx.data().config.is_maintenance {
                        let _ = ctx
                            .say("⚠️ Maintenance in progress. Please try again later.")
                            .await;
                        return Ok(false);
                    }
                    Ok(true)
                })
            }),
            event_handler: |ctx, event, _framework, data| {
                Box::pin(async move {
                    match event {
                        FullEvent::Ready { data_about_bot, .. } => {
                            tracing::info!("Logged in as {}", data_about_bot.user.name);
                            if let Some(activity) = &data.config.default_activity {
                                ctx.set_activity(Some(ActivityData::playing(activity.clone())));
                            }
                        }
                        FullEvent::InteractionCreate { interaction } => {
                            if let Some(component) = interaction.as_message_component() {
                                buttons::handle_component(ctx, component, data).await;
                            }
                        }
                        _ => {}
                    }
                    Ok(())
                })
            },
            on_error: |error| {
                Box::pin(async move {
                    match error {
                        poise::FrameworkError::Command { error, ctx, .. } => {
                            tracing::error!("Command error: {error:#}");
                            let _ = ctx.say(format!("Command error: {error}")).await;
                        }
                        other => {
                            tracing::error!("Framework error: {other}");
                        }
                    }
                })
            },
            ..Default::default()
        })
        .setup(|ctx, _ready, framework| {
            Box::pin(async move {
                poise::builtins::register_globally(ctx, &framework.options().commands).await?;
                Ok(data)
            })
        })
        .build();

    let mut client = ClientBuilder::new(&config.bot_token, intents)
        .framework(framework)
        .await
        .context("build discord client")?;

    tracing::info!("AronaBot starting...");
    client.start().await.context("discord client")?;
    Ok(())
}
