use crate::data::{Context, Error};
use crate::render::CardInput;
use crate::utils::constants::{game_blue, game_red};
use base64::{engine::general_purpose::STANDARD as BASE64, Engine};
use poise::serenity_prelude as serenity;
use rand::SeedableRng;
use rand_chacha::ChaCha8Rng;
use serenity::all::{CreateAttachment, CreateEmbed};
use sha2::{Digest, Sha256};

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

/// Roll on the current banners.
#[poise::command(
    slash_command,
    rename = "gacha",
    description_localized("en-US", "Roll on the current banners.")
)]
pub async fn gacha(
    ctx: Context<'_>,
    #[description = "The banner to pull on."]
    #[autocomplete = "banner_autocomplete"]
    banner: String,
) -> Result<(), Error> {
    ctx.defer().await?;

    let banner_id = if banner.is_empty() {
        "regular".to_string()
    } else {
        banner
    };

    let guild_id = ctx.guild_id().map(|g| g.to_string()).unwrap_or_else(|| "0".into());
    let user_id = ctx.author().id.to_string();

    let banners = ctx.data().containers.banners.read().await;
    let Some(banner) = banners.get_banner(&banner_id) else {
        ctx.say("Invalid banner.").await?;
        return Ok(());
    };

    let points = ctx
        .data()
        .points
        .increment_and_get(banner.kind, &guild_id, &user_id)
        .await?;

    let mut rng = ChaCha8Rng::from_entropy();
    let students = match banner.pull_ten(&mut rng) {
        Ok(s) => s,
        Err(e) => {
            ctx.say(e.to_string()).await?;
            return Ok(());
        }
    };

    let cards: Vec<CardInput> = students
        .iter()
        .map(|(student, key)| CardInput {
            student_id: student.id.clone(),
            rarity: student.rarity,
            is_pickup: banner.is_pickup(key),
        })
        .collect();

    let names: Vec<String> = students
        .iter()
        .map(|(s, _)| s.name.clone())
        .collect();

    drop(banners);

    match ctx.data().renderer.render(&cards, points).await {
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

/// Use 200 recruitment points on a game region.
#[poise::command(slash_command)]
pub async fn spark(
    ctx: Context<'_>,
    #[description = "The game region to reset."] region: Option<RegionChoice>,
) -> Result<(), Error> {
    ctx.defer().await?;

    let banner_kind: crate::db::BannerKind =
        region.unwrap_or(RegionChoice::Global).into();

    let guild_id = ctx.guild_id().map(|g| g.to_string()).unwrap_or_else(|| "0".into());
    let user_id = ctx.author().id.to_string();

    let current = ctx
        .data()
        .points
        .get(banner_kind, &guild_id, &user_id)
        .await?;

    if current.unwrap_or(0) < 200 {
        let embed = CreateEmbed::new()
            .title("Recruitment Points Reset")
            .description(format!(
                "You may not use this command until you have at least 200 recruitment points on **{banner_kind}**."
            ))
            .colour(game_red());
        ctx.send(poise::CreateReply::default().embed(embed)).await?;
        return Ok(());
    }

    let amount = current.unwrap_or(0) - 200;
    ctx.data()
        .points
        .set(banner_kind, &guild_id, &user_id, amount)
        .await?;

    let embed = CreateEmbed::new()
        .title("Recruitment Points Reset")
        .description(format!(
            "Used 200 of your recruitment points on **{banner_kind}**."
        ))
        .colour(game_blue());
    ctx.send(poise::CreateReply::default().embed(embed)).await?;
    Ok(())
}

fn seeded_rng(seed_str: &str) -> ChaCha8Rng {
    let mut hasher = Sha256::new();
    hasher.update(seed_str.as_bytes());
    let hash = hasher.finalize();
    let mut seed = [0u8; 32];
    seed.copy_from_slice(&hash);
    ChaCha8Rng::from_seed(seed)
}

fn make_seed_string(timestamp: i64, user_id: &str) -> String {
    BASE64
        .encode(format!("{timestamp}/{user_id}"))
        .replace('=', "")
}

/// Simulate bi-daily cafe visits.
#[poise::command(slash_command)]
pub async fn cafe(ctx: Context<'_>) -> Result<(), Error> {
    use crate::utils::date::current_closest_breakpoint_jst;
    use chrono::Duration;
    use rand::Rng;

    ctx.defer().await?;

    let user_id = ctx.author().id.to_string();
    let closest = current_closest_breakpoint_jst();
    let timestamp = closest.timestamp();

    let seed = make_seed_string(timestamp, &user_id);
    let mut rng = seeded_rng(&seed);

    let students = ctx.data().containers.students.read().await;
    let mut bases: Vec<_> = students
        .get_base_variants()
        .into_iter()
        .map(|s| s.id().to_string())
        .collect();

    let mut cafe1 = Vec::new();
    let mut cafe2 = Vec::new();

    for i in 0..10 {
        if bases.is_empty() {
            break;
        }
        let idx = rng.gen_range(0..bases.len());
        let base_id = bases.remove(idx);
        let Some(base) = students.get_student(&base_id) else {
            continue;
        };
        let variants = students.get_variants_for_base(base);
        let variant = variants[rng.gen_range(0..variants.len())];
        if i < 5 {
            cafe1.push(variant.name().to_string());
        } else {
            cafe2.push(variant.name().to_string());
        }
    }

    let next = closest + Duration::hours(12);

    let embed = CreateEmbed::new()
        .title("Cafe Visits")
        .description("Sensei! The following students have visited your cafes!")
        .field("Cafe 1", cafe1.join("\n"), true)
        .field("Cafe 2", cafe2.join("\n"), true)
        .field("Next Cafe Visit", format!("<t:{}:R>", next.timestamp()), false)
        .colour(0x58dcf3)
        .footer(serenity::CreateEmbedFooter::new(format!("Time: {timestamp}")));

    ctx.send(poise::CreateReply::default().embed(embed)).await?;
    Ok(())
}

/// Find out who your student of the day is!
#[poise::command(slash_command, rename = "studentoftheday")]
pub async fn student_of_the_day(
    ctx: Context<'_>,
    #[description = "The date to get the student of the day for (YYYY/MM/DD)."] date: Option<
        String,
    >,
) -> Result<(), Error> {
    use crate::utils::date::{current_time_jst, reset_time_for_date_jst};
    use crate::utils::student::{attack_type_color, portrait_url};
    use chrono::{Datelike, NaiveDate, TimeZone};
    use rand::Rng;

    ctx.defer().await?;

    let user_id = ctx.author().id.to_string();
    let today = current_time_jst();

    let date = if let Some(date_arg) = date {
        // Match TS: new Date(str); date.setDate(date.getDate() + 1); dateToJST
        let parsed = NaiveDate::parse_from_str(&date_arg.replace('-', "/"), "%Y/%m/%d")
            .or_else(|_| NaiveDate::parse_from_str(&date_arg, "%Y-%m-%d"));
        match parsed {
            Ok(d) => {
                let d = d + chrono::Duration::days(1);
                chrono_tz::Asia::Tokyo
                    .with_ymd_and_hms(d.year(), d.month(), d.day(), 0, 0, 0)
                    .single()
                    .map(|dt| dt.with_timezone(&chrono::Utc))
            }
            Err(_) => None,
        }
    } else {
        Some(today)
    };

    let Some(date) = date else {
        ctx.say("Invalid date provided.").await?;
        return Ok(());
    };

    if date > today {
        ctx.say("Input cannot be a future date.").await?;
        return Ok(());
    }

    let reset_date = reset_time_for_date_jst(date);
    let date_timestamp = reset_date.timestamp();

    let seed = make_seed_string(date_timestamp, &user_id);
    let mut rng = seeded_rng(&seed);

    let students = ctx.data().containers.students.read().await;
    let all = students.get_students();
    if all.is_empty() {
        ctx.say("No students loaded.").await?;
        return Ok(());
    }
    let student = all[rng.gen_range(0..all.len())];

    let tomorrow = today + chrono::Duration::days(1);
    let tomorrow_reset = reset_time_for_date_jst(tomorrow);
    let tomorrow_ts = tomorrow_reset.timestamp();

    let same_day = date.year() == today.year()
        && date.month() == today.month()
        && date.day() == today.day();

    let description = if same_day {
        format!(
            "<@{}>'s student of the day is **{}**.\n\nNext student of the day can be chosen <t:{}:R>",
            user_id,
            student.name(),
            tomorrow_ts
        )
    } else {
        format!(
            "<@{}>'s student of the day on **{}** was **{}**.",
            user_id,
            reset_date.format("%a %b %d %Y"),
            student.name()
        )
    };

    let portrait_base = ctx
        .data()
        .config
        .r2_public_access_url
        .as_deref()
        .unwrap_or("https://aronabot.cdn.nimblebun.works");

    let embed = CreateEmbed::new()
        .title(format!("{} {}", student.last_name, student.first_name))
        .description(description)
        .image(portrait_url(portrait_base, student))
        .colour(attack_type_color(student.attack_type))
        .footer(serenity::CreateEmbedFooter::new(format!("Seed: {seed}")));

    ctx.send(poise::CreateReply::default().embed(embed)).await?;
    Ok(())
}
