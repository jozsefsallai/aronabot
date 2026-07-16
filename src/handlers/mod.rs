use crate::db::models::DetailedStudent;
use crate::utils::constants::game_blue;
use crate::utils::localize::{
    attack_type, club, combat_class, combat_position, combat_role, defense_type, school,
    skill_type, weapon_type,
};
use crate::utils::student::{
    attack_type_color, portrait_url, schale_db_url, student_next_birthday_string,
};
use serenity::all::{ButtonStyle, CreateActionRow, CreateButton, CreateEmbed};

fn separator() -> (String, String, bool) {
    (" ".into(), " ".into(), true)
}

pub fn build_student_embed(
    student: &DetailedStudent,
    portrait_base: &str,
) -> (CreateEmbed, Option<CreateActionRow>) {
    let mut rarity = format!("{}★", student.rarity);
    if student.is_limited_jp {
        rarity = format!("{rarity} (Limited)");
    }
    if student.is_welfare_jp {
        rarity = format!("{rarity} (Welfare)");
    }

    let schaledb = schale_db_url(student);
    let portrait = portrait_url(portrait_base, student);
    let next_birthday = student_next_birthday_string(student);

    let mut embed = CreateEmbed::new()
        .title(format!("{} {}", student.last_name, student.first_name))
        .url(&schaledb)
        .thumbnail(&portrait)
        .color(attack_type_color(student.attack_type));

    if let Some(intro) = &student.introduction {
        embed = embed.description(intro);
    }

    let sep = separator();
    embed = embed.fields([
        ("School".into(), school(student.school), true),
        ("Club".into(), club(student.club), true),
        sep.clone(),
        ("Age".into(), student.age.clone(), true),
        ("Birthday".into(), student.birthday.clone(), true),
        (
            "Height".into(),
            student.height.clone().unwrap_or_else(|| "N/A".into()),
            true,
        ),
        (
            "Hobbies".into(),
            student.hobbies.clone().unwrap_or_else(|| "N/A".into()),
            true,
        ),
        ("Next Birthday".into(), next_birthday, true),
        sep.clone(),
        ("Attack Type".into(), attack_type(student.attack_type), true),
        (
            "Defense Type".into(),
            defense_type(student.defense_type),
            true,
        ),
        sep.clone(),
        ("Class".into(), combat_class(student.combat_class), true),
        ("Role".into(), combat_role(student.combat_role), true),
        (
            "Position".into(),
            combat_position(student.combat_position),
            true,
        ),
        (
            "Uses Cover".into(),
            if student.uses_cover {
                "Yes".into()
            } else {
                "No".into()
            },
            true,
        ),
        (
            "Weapon Type".into(),
            weapon_type(student.weapon_type),
            true,
        ),
        sep.clone(),
        ("Rarity".into(), rarity, true),
        (
            "Rec. Lobby unlock level".into(),
            if student.memorobi_level > 0 {
                format!("❤️ {}", student.memorobi_level)
            } else {
                "N/A".into()
            },
            true,
        ),
        sep,
        ("View on schale.gg".into(), schaledb, false),
    ]);

    let components = if student.skills.is_empty() {
        None
    } else {
        let button = CreateButton::new(format!("skills_{}", student.id))
            .label("Skills")
            .style(ButtonStyle::Primary);
        Some(CreateActionRow::Buttons(vec![button]))
    };

    (embed, components)
}

pub fn build_skills_embed(
    student: &DetailedStudent,
    portrait_base: &str,
) -> Result<(CreateEmbed, CreateActionRow), String> {
    if student.skills.is_empty() {
        return Err(format!(
            "{} currently does not have skill data.",
            student.name
        ));
    }

    let schaledb = schale_db_url(student);
    let portrait = portrait_url(portrait_base, student);

    let mut embed = CreateEmbed::new()
        .title(format!("{} Skills", student.name))
        .url(&schaledb)
        .thumbnail(&portrait)
        .color(game_blue());

    for skill in &student.skills {
        let kind = skill_type(skill.r#type);
        embed = embed.field(format!("{kind}: {}", skill.name), &skill.description, false);
    }

    let button = CreateButton::new(format!("student_{}", student.id))
        .label("Student Details")
        .style(ButtonStyle::Primary);

    Ok((embed, CreateActionRow::Buttons(vec![button])))
}
