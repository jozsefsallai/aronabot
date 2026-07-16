use chrono::{Datelike, Local, NaiveDate, TimeZone, Utc};

use crate::db::enums::{AttackType, DefenseType};
use crate::db::models::Student;

use super::constants::{game_blue, game_purple, game_red, game_yellow};
use super::date::{parse_birthday, Birthday};

pub fn schale_db_url(student: &Student) -> String {
    format!("https://schaledb.com/student/{}", student.id)
}

pub fn portrait_url(base: &str, student: &Student) -> String {
    let base = base.trim_end_matches('/');
    format!("{base}/v2/images/students/portraits/{}.png", student.id)
}

pub fn gift_icon_url(icon_name: &str) -> String {
    format!("https://schaledb.com/images/item/icon/{icon_name}.webp")
}

pub fn student_birthday_data(student: &Student) -> Option<Birthday> {
    parse_birthday(&student.birthday)
}

pub fn student_next_birthday(student: &Student) -> Option<chrono::DateTime<Utc>> {
    let birthday = student_birthday_data(student)?;
    let today = Local::now();

    let current_year = today.year();
    let current_month = today.month0();

    let next_birthday_year = if current_month > birthday.month {
        current_year + 1
    } else {
        current_year
    };

    // Birthday months are 0-based (JS); NaiveDate months are 1-based.
    let naive = NaiveDate::from_ymd_opt(
        next_birthday_year,
        birthday.month + 1,
        birthday.day,
    )?;

    Local
        .from_local_datetime(&naive.and_hms_opt(0, 0, 0)?)
        .single()
        .map(|dt| dt.with_timezone(&Utc))
}

pub fn student_has_birthday_on_month(student: &Student, month: u32) -> bool {
    student_birthday_data(student)
        .map(|b| b.month == month)
        .unwrap_or(false)
}

pub fn has_birthday_this_month(student: &Student) -> bool {
    let today = Local::now();
    student_has_birthday_on_month(student, today.month0())
}

pub fn student_has_birthday_today(student: &Student) -> bool {
    let birthday = match student_birthday_data(student) {
        Some(b) => b,
        None => return false,
    };

    let today = Local::now();
    birthday.month == today.month0() && birthday.day == today.day()
}

pub fn student_next_birthday_string(student: &Student) -> String {
    match student_next_birthday(student) {
        Some(next) => format!("<t:{}:R>", next.timestamp()),
        None => "N/A".to_string(),
    }
}

pub fn attack_type_color(attack_type: AttackType) -> serenity::all::Colour {
    match attack_type {
        AttackType::Explosion => game_red(),
        AttackType::Pierce => game_yellow(),
        AttackType::Mystic => game_blue(),
        AttackType::Sonic => game_purple(),
        _ => game_blue(),
    }
}

pub fn defense_type_color(defense_type: DefenseType) -> serenity::all::Colour {
    match defense_type {
        DefenseType::LightArmor => game_red(),
        DefenseType::HeavyArmor => game_yellow(),
        DefenseType::Unarmed => game_blue(),
        DefenseType::ElasticArmor => game_purple(),
        _ => game_blue(),
    }
}
