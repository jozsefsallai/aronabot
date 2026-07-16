use crate::data::{Context, Error};
use crate::render::CardInput;
use poise::serenity_prelude as serenity;
use rand::SeedableRng;
use serenity::all::{CreateAttachment, CreateEmbed};

async fn is_staff(ctx: Context<'_>) -> Result<bool, Error> {
    Ok(ctx.data().config.is_staff(&ctx.author().id.to_string()))
}

#[derive(Debug, Clone, Copy, poise::ChoiceParameter)]
pub enum RegionChoice {
    Global,
    JP,
}

impl From<RegionChoice> for crate::db::BannerKind {
    fn from(value: RegionChoice) -> Self {
        match value {
            RegionChoice::Global => Self::Global,
            RegionChoice::JP => Self::JP,
        }
    }
}

async fn banner_autocomplete<'a>(
    ctx: Context<'a>,
    _partial: &'a str,
) -> impl Iterator<Item = poise::serenity_prelude::AutocompleteChoice> + 'a {
    let banners = ctx.data().containers.banners.read().await;
    let choices: Vec<_> = banners
        .all()
        .iter()
        .take(25)
        .map(|b| poise::serenity_prelude::AutocompleteChoice::new(b.name.clone(), b.id.clone()))
        .collect();
    choices.into_iter()
}

/// [STAFF] Reload containers.
#[poise::command(slash_command, check = "is_staff", ephemeral, default_member_permissions = "ADMINISTRATOR")]
pub async fn reload(ctx: Context<'_>) -> Result<(), Error> {
    ctx.defer_ephemeral().await?;
    ctx.data()
        .containers
        .reload(&ctx.data().pool)
        .await?;
    ctx.say("Containers reloaded.").await?;
    Ok(())
}

/// [STAFF] Reset recruitment points.
#[poise::command(slash_command, check = "is_staff", ephemeral, default_member_permissions = "ADMINISTRATOR")]
pub async fn rrp(
    ctx: Context<'_>,
    #[description = "The game region to reset recruitment points for."] region: Option<RegionChoice>,
) -> Result<(), Error> {
    ctx.defer_ephemeral().await?;

    let banner_kind: crate::db::BannerKind =
        region.unwrap_or(RegionChoice::Global).into();

    let result = ctx.data().points.reset_all(banner_kind).await?;
    if result {
        ctx.say(format!("Recruitment points reset for {banner_kind}."))
            .await?;
    } else {
        ctx.say("Failed to reset recruitment points. Was the Redis connection established?")
            .await?;
    }
    Ok(())
}

/// [STAFF] Quick gacha.
#[poise::command(slash_command, check = "is_staff", ephemeral, rename = "quick-gacha", default_member_permissions = "ADMINISTRATOR")]
pub async fn quick_gacha(
    ctx: Context<'_>,
    #[description = "The banner to simulate."]
    #[autocomplete = "banner_autocomplete"]
    banner: String,
) -> Result<(), Error> {
    ctx.defer_ephemeral().await?;

    let banner_id = if banner.is_empty() {
        "regular".to_string()
    } else {
        banner
    };

    let banners = ctx.data().containers.banners.read().await;
    let Some(banner) = banners.get_banner(&banner_id) else {
        ctx.say("Invalid banner.").await?;
        return Ok(());
    };

    let mut cards = Vec::new();
    let mut got_rate_up = false;
    let mut points = 0i64;
    let mut rng = rand_chacha::ChaCha8Rng::from_entropy();

    while !got_rate_up {
        points += 10;
        let students = match banner.pull_ten(&mut rng) {
            Ok(s) => s,
            Err(_) => {
                ctx.say("Failed to pull 10 students...").await?;
                return Ok(());
            }
        };

        got_rate_up = students.iter().any(|(_, key)| banner.is_pickup(key));
        if got_rate_up {
            for (student, key) in students {
                cards.push(CardInput {
                    student_id: student.id.clone(),
                    rarity: student.rarity,
                    is_pickup: banner.is_pickup(&key),
                });
            }
        }

        if points >= 2000 {
            ctx.say("Reached 2000 points without pulling a rate-up student. Stopping simulation.")
                .await?;
            return Ok(());
        }
    }

    let names: Vec<_> = cards.iter().map(|c| c.student_id.clone()).collect();
    drop(banners);

    match ctx.data().renderer.render(&cards, Some(points)).await {
        Ok(png) => {
            let attachment = CreateAttachment::bytes(png, "gacha_result.png");
            ctx.send(poise::CreateReply::default().attachment(attachment))
                .await?;
        }
        Err(_) => {
            let embed = CreateEmbed::new()
                .title("Error")
                .description(format!(
                    "An unexpected error occurred and the gacha result image couldn't be rendered. You rolled the following students:\n```\n{}```",
                    names.join(", ")
                ))
                .colour(0xff0000);
            ctx.send(poise::CreateReply::default().embed(embed)).await?;
        }
    }

    Ok(())
}

/// [STAFF] Simulate gacha pulls to audit rates.
#[poise::command(slash_command, check = "is_staff", ephemeral, rename = "simulate-gacha", default_member_permissions = "ADMINISTRATOR")]
pub async fn simulate_gacha(
    ctx: Context<'_>,
    #[description = "The banner to simulate."]
    #[autocomplete = "banner_autocomplete"]
    banner: String,
    #[description = "The number of simulations."] count: Option<i32>,
    #[description = "The number of pulls per simulation."]
    #[rename = "pulls-per-simulation"]
    pulls_per_simulation: Option<i32>,
) -> Result<(), Error> {
    ctx.defer_ephemeral().await?;

    let banner_id = if banner.is_empty() {
        "regular".to_string()
    } else {
        banner
    };
    let count = count.unwrap_or(10).max(1) as usize;
    let pulls_per_simulation = pulls_per_simulation.unwrap_or(1000).max(1) as usize;

    let banners = ctx.data().containers.banners.read().await;
    let Some(banner) = banners.get_banner(&banner_id) else {
        ctx.say("Banner not found!").await?;
        return Ok(());
    };

    let mut results = Vec::new();
    let mut rng = rand_chacha::ChaCha8Rng::from_entropy();

    for _ in 0..count {
        let mut one_star_count = 0usize;
        let mut two_star_count = 0usize;
        let mut three_star_count = 0usize;
        let mut pickup_count = 0usize;
        let mut extra_count = 0usize;
        let mut additional_three_star_count = 0usize;

        for _ in 0..pulls_per_simulation {
            let students = match banner.pull_ten(&mut rng) {
                Ok(s) => s,
                Err(e) => {
                    ctx.say(e.to_string()).await?;
                    return Ok(());
                }
            };

            for (student, _) in &students {
                match student.rarity {
                    1 => one_star_count += 1,
                    2 => two_star_count += 1,
                    3 => three_star_count += 1,
                    _ => {}
                }
                if banner.is_pickup(&student.id) {
                    pickup_count += 1;
                }
                if banner.is_extra(&student.id) {
                    extra_count += 1;
                }
                if banner.is_additional_three_star(&student.id) {
                    additional_three_star_count += 1;
                }
            }
        }

        let denom = pulls_per_simulation as f64;
        results.push(serde_json::json!({
            "oneStarCount": one_star_count,
            "twoStarCount": two_star_count,
            "threeStarCount": three_star_count,
            "pickupCount": pickup_count,
            "extraCount": extra_count,
            "additionalThreeStarCount": additional_three_star_count,
            "oneStarRate": one_star_count as f64 / denom,
            "twoStarRate": two_star_count as f64 / denom,
            "threeStarRate": three_star_count as f64 / denom,
            "pickupRate": pickup_count as f64 / denom,
            "extraRate": extra_count as f64 / denom,
            "additionalThreeStarRate": additional_three_star_count as f64 / denom,
        }));
    }

    let mut summary = serde_json::json!({
        "oneStarCount": 0,
        "twoStarCount": 0,
        "threeStarCount": 0,
        "pickupCount": 0,
        "extraCount": 0,
        "additionalThreeStarCount": 0,
    });

    for result in &results {
        for key in [
            "oneStarCount",
            "twoStarCount",
            "threeStarCount",
            "pickupCount",
            "extraCount",
            "additionalThreeStarCount",
        ] {
            let v = summary[key].as_u64().unwrap_or(0) + result[key].as_u64().unwrap_or(0);
            summary[key] = serde_json::json!(v);
        }
    }

    let total = (pulls_per_simulation * count) as f64;
    summary["oneStarRate"] = serde_json::json!(summary["oneStarCount"].as_u64().unwrap_or(0) as f64 / total);
    summary["twoStarRate"] = serde_json::json!(summary["twoStarCount"].as_u64().unwrap_or(0) as f64 / total);
    summary["threeStarRate"] = serde_json::json!(summary["threeStarCount"].as_u64().unwrap_or(0) as f64 / total);
    summary["pickupRate"] = serde_json::json!(summary["pickupCount"].as_u64().unwrap_or(0) as f64 / total);
    summary["extraRate"] = serde_json::json!(summary["extraCount"].as_u64().unwrap_or(0) as f64 / total);
    summary["additionalThreeStarRate"] =
        serde_json::json!(summary["additionalThreeStarCount"].as_u64().unwrap_or(0) as f64 / total);

    let json = serde_json::json!({
        "bannerName": banner_id,
        "count": count,
        "pullsPerSimulation": pulls_per_simulation,
        "results": results,
        "summary": summary,
    });

    let file = serde_json::to_vec_pretty(&json)?;
    let attachment = CreateAttachment::bytes(file, "gacha_simulation.json");
    ctx.send(poise::CreateReply::default().attachment(attachment))
        .await?;
    Ok(())
}
