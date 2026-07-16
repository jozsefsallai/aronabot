use crate::data::{Context, Error};
use crate::handlers::{build_skills_embed, build_student_embed};
use crate::utils::date::MONTHS;
use crate::utils::localize::terrain;
use crate::utils::student::{
    gift_icon_url, portrait_url, student_birthday_data, student_has_birthday_on_month,
    student_has_birthday_today,
};
use poise::serenity_prelude as serenity;
use serenity::all::CreateEmbed;

async fn student_name_autocomplete(
    ctx: Context<'_>,
    partial: &str,
) -> Vec<poise::serenity_prelude::AutocompleteChoice> {
    if partial.len() < 2 {
        return vec![];
    }
    let students = ctx.data().containers.students.read().await;
    let mut matches = students.find_many_by_name(partial);
    crate::containers::StudentContainer::sort_by_similarity(partial, &mut matches);
    matches
        .into_iter()
        .take(25)
        .map(|s| {
            poise::serenity_prelude::AutocompleteChoice::new(s.name().to_string(), s.name().to_string())
        })
        .collect()
}

/// Get information about a student.
#[poise::command(slash_command)]
pub async fn student(
    ctx: Context<'_>,
    #[description = "The name of the student."]
    #[autocomplete = "student_name_autocomplete"]
    name: String,
) -> Result<(), Error> {
    ctx.defer().await?;

    let students = ctx.data().containers.students.read().await;
    let Some(student) = students.get_by_name(&name) else {
        ctx.say(format!("Could not find a student with the name \"{name}\".")).await?;
        return Ok(());
    };

    let portrait_base = ctx
        .data()
        .config
        .r2_public_access_url
        .as_deref()
        .unwrap_or("https://aronabot.cdn.nimblebun.works");

    let (embed, components) = build_student_embed(student, portrait_base);
    let mut reply = poise::CreateReply::default().embed(embed);
    if let Some(row) = components {
        reply = reply.components(vec![row]);
    }
    ctx.send(reply).await?;
    Ok(())
}

/// (BETA) Get information about a student's skills.
#[poise::command(slash_command)]
pub async fn skills(
    ctx: Context<'_>,
    #[description = "The name of the student."]
    #[autocomplete = "student_name_autocomplete"]
    name: String,
) -> Result<(), Error> {
    ctx.defer().await?;

    let students = ctx.data().containers.students.read().await;
    let Some(student) = students.get_by_name(&name) else {
        ctx.say(format!("Could not find a student with the name \"{name}\".")).await?;
        return Ok(());
    };

    let portrait_base = ctx
        .data()
        .config
        .r2_public_access_url
        .as_deref()
        .unwrap_or("https://aronabot.cdn.nimblebun.works");

    match build_skills_embed(student, portrait_base) {
        Ok((embed, row)) => {
            ctx.send(poise::CreateReply::default().embed(embed).components(vec![row]))
                .await?;
        }
        Err(msg) => {
            ctx.say(msg).await?;
        }
    }
    Ok(())
}

/// Get information and map preview about a mission.
#[poise::command(slash_command)]
pub async fn mission(
    ctx: Context<'_>,
    #[description = "The name of the mission."] name: String,
) -> Result<(), Error> {
    ctx.defer().await?;

    let missions = ctx.data().containers.missions.read().await;
    let Some(mission) = missions.get_mission_with_name(&name) else {
        ctx.say(format!("Could not find mission \"{name}\".")).await?;
        return Ok(());
    };

    let wiki_url = format!("https://bluearchive.wiki/wiki/Missions/{}", mission.name);

    let mut embed = CreateEmbed::new()
        .title(&mission.name)
        .url(&wiki_url)
        .field("Cost", mission.cost.to_string(), true)
        .field(
            "Difficulty",
            mission
                .difficulty
                .map(|d| d.to_string())
                .unwrap_or_else(|| "Unknown".into()),
            true,
        )
        .field(
            "Terrain",
            mission
                .terrain
                .map(terrain)
                .unwrap_or_else(|| "Unknown".into()),
            true,
        )
        .field("Rec. lvl", mission.recommended_level.to_string(), true)
        .field("Drops", mission.drops.join(", "), false)
        .field("Text guide", &wiki_url, false);

    if let Some(url) = &mission.stage_image_url {
        embed = embed.image(url);
    }

    ctx.send(poise::CreateReply::default().embed(embed)).await?;
    Ok(())
}

#[derive(Debug, Clone, Copy, poise::ChoiceParameter)]
pub enum MonthChoice {
    #[name = "January"]
    January = 0,
    #[name = "February"]
    February = 1,
    #[name = "March"]
    March = 2,
    #[name = "April"]
    April = 3,
    #[name = "May"]
    May = 4,
    #[name = "June"]
    June = 5,
    #[name = "July"]
    July = 6,
    #[name = "August"]
    August = 7,
    #[name = "September"]
    September = 8,
    #[name = "October"]
    October = 9,
    #[name = "November"]
    November = 10,
    #[name = "December"]
    December = 11,
}

/// Get a list of student birthdays for a given month.
#[poise::command(slash_command)]
pub async fn birthdays(
    ctx: Context<'_>,
    #[description = "The month to get birthdays for."] month: Option<MonthChoice>,
) -> Result<(), Error> {
    use chrono::Datelike;

    ctx.defer().await?;

    let month = month.map(|m| m as u32).unwrap_or_else(|| chrono::Local::now().month0());
    if month > 11 {
        ctx.say("Invalid month.").await?;
        return Ok(());
    }

    let students = ctx.data().containers.students.read().await;
    let mut matches: Vec<_> = students
        .get_students()
        .into_iter()
        .filter(|s| student_has_birthday_on_month(s, month))
        .collect();

    if matches.is_empty() {
        ctx.say(format!("No students have birthdays in {}.", MONTHS[month as usize]))
            .await?;
        return Ok(());
    }

    matches.sort_by(|a, b| {
        let a_day = student_birthday_data(a).map(|b| b.day).unwrap_or(0);
        let b_day = student_birthday_data(b).map(|b| b.day).unwrap_or(0);
        a_day.cmp(&b_day)
    });

    let mut lines: Vec<String> = matches
        .iter()
        .map(|student| {
            let mut line = format!(
                "🎂 {} {} - {}",
                student.last_name, student.first_name, student.birthday
            );
            if student_has_birthday_today(student) {
                line = format!("**🎉 {line} 🎉**");
            }
            line
        })
        .collect();
    lines.sort();
    lines.dedup();

    let embed = CreateEmbed::new()
        .title(format!("Birthdays in {}", MONTHS[month as usize]))
        .description(lines.join("\n"));

    ctx.send(poise::CreateReply::default().embed(embed)).await?;
    Ok(())
}

async fn gift_name_autocomplete(
    ctx: Context<'_>,
    partial: &str,
) -> Vec<poise::serenity_prelude::AutocompleteChoice> {
    if partial.len() < 2 {
        return vec![];
    }
    let gifts = ctx.data().containers.gifts.read().await;
    gifts
        .find_many_by_name(partial)
        .into_iter()
        .take(25)
        .map(|g| {
            poise::serenity_prelude::AutocompleteChoice::new(g.name.clone(), g.name.clone())
        })
        .collect()
}

/// Get information about a gift or the gifts liked by a student.
#[poise::command(slash_command)]
pub async fn gifts(
    ctx: Context<'_>,
    #[description = "The name of the gift."]
    #[autocomplete = "gift_name_autocomplete"]
    gift: Option<String>,
    #[description = "The name of the student."]
    #[autocomplete = "student_name_autocomplete"]
    student: Option<String>,
) -> Result<(), Error> {
    ctx.defer().await?;

    match (gift, student) {
        (None, None) => {
            ctx.say("You need to specify a gift or a student.").await?;
        }
        (Some(_), Some(_)) => {
            ctx.say("You can only specify a gift or a student, not both.").await?;
        }
        (Some(gift_name), None) => {
            let gifts = ctx.data().containers.gifts.read().await;
            let Some(gift_data) = gifts.get_gift_with_name(&gift_name) else {
                ctx.say(format!("Could not find a gift with the name \"{gift_name}\".")).await?;
                return Ok(());
            };

            let mut embed = CreateEmbed::new().title(&gift_data.name);
            if let Some(desc) = &gift_data.description {
                embed = embed.description(desc);
            }
            embed = embed
                .thumbnail(gift_icon_url(&gift_data.icon_name))
                .field("Rarity", gift_data.rarity.to_string(), false);

            let adored_exp = 4 * gift_data.exp_value;
            let loved_exp = 3 * gift_data.exp_value;
            let liked_exp = 2 * gift_data.exp_value;

            if !gift_data.adored_by.is_empty() {
                let names: Vec<_> = gift_data.adored_by.iter().map(|s| s.name.as_str()).collect();
                embed = embed.field(
                    format!("Adored by ({adored_exp} EXP):"),
                    format!("- {}", names.join("\n- ")),
                    true,
                );
            }
            if !gift_data.loved_by.is_empty() {
                let names: Vec<_> = gift_data.loved_by.iter().map(|s| s.name.as_str()).collect();
                embed = embed.field(
                    format!("Loved by ({loved_exp} EXP):"),
                    format!("- {}", names.join("\n- ")),
                    true,
                );
            }
            if !gift_data.liked_by.is_empty() {
                let names: Vec<_> = gift_data.liked_by.iter().map(|s| s.name.as_str()).collect();
                embed = embed.field(
                    format!("Liked by ({liked_exp} EXP):"),
                    format!("- {}", names.join("\n- ")),
                    true,
                );
            }

            ctx.send(poise::CreateReply::default().embed(embed)).await?;
        }
        (None, Some(student_name)) => {
            let students = ctx.data().containers.students.read().await;
            let Some(student_data) = students.get_by_name(&student_name) else {
                ctx.say(format!("Could not find student \"{student_name}\".")).await?;
                return Ok(());
            };

            let portrait_base = ctx
                .data()
                .config
                .r2_public_access_url
                .as_deref()
                .unwrap_or("https://aronabot.cdn.nimblebun.works");

            let mut embed = CreateEmbed::new()
                .title(student_data.name())
                .thumbnail(portrait_url(portrait_base, student_data));

            if !student_data.gifts_adored.is_empty() {
                let names: Vec<_> = student_data
                    .gifts_adored
                    .iter()
                    .map(|g| g.name.as_str())
                    .collect();
                embed = embed.field(
                    "Adored Gifts",
                    format!("- {}", names.join("\n- ")),
                    true,
                );
            }
            if !student_data.gifts_loved.is_empty() {
                let names: Vec<_> = student_data
                    .gifts_loved
                    .iter()
                    .map(|g| g.name.as_str())
                    .collect();
                embed = embed.field(
                    "Loved Gifts",
                    format!("- {}", names.join("\n- ")),
                    true,
                );
            }
            if !student_data.gifts_liked.is_empty() {
                let names: Vec<_> = student_data
                    .gifts_liked
                    .iter()
                    .map(|g| g.name.as_str())
                    .collect();
                embed = embed.field(
                    "Liked Gifts",
                    format!("- {}", names.join("\n- ")),
                    true,
                );
            }

            ctx.send(poise::CreateReply::default().embed(embed)).await?;
        }
    }

    Ok(())
}
