pub mod fun;
pub mod staff;
pub mod utils;

use crate::data::{Data, Error};

pub fn all_commands() -> Vec<poise::Command<Data, Error>> {
    vec![
        fun::gacha(),
        fun::spark(),
        fun::cafe(),
        fun::student_of_the_day(),
        utils::student(),
        utils::skills(),
        utils::mission(),
        utils::birthdays(),
        utils::gifts(),
        staff::reload(),
        staff::rrp(),
        staff::quick_gacha(),
        staff::simulate_gacha(),
    ]
}
