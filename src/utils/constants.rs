pub const GAME_RED: (u8, u8, u8) = (147, 0, 8);
pub const GAME_YELLOW: (u8, u8, u8) = (191, 137, 1);
pub const GAME_BLUE: (u8, u8, u8) = (34, 111, 156);
pub const GAME_PURPLE: (u8, u8, u8) = (121, 67, 148);

pub fn game_red() -> serenity::all::Colour {
    serenity::all::Colour::from_rgb(GAME_RED.0, GAME_RED.1, GAME_RED.2)
}

pub fn game_yellow() -> serenity::all::Colour {
    serenity::all::Colour::from_rgb(GAME_YELLOW.0, GAME_YELLOW.1, GAME_YELLOW.2)
}

pub fn game_blue() -> serenity::all::Colour {
    serenity::all::Colour::from_rgb(GAME_BLUE.0, GAME_BLUE.1, GAME_BLUE.2)
}

pub fn game_purple() -> serenity::all::Colour {
    serenity::all::Colour::from_rgb(GAME_PURPLE.0, GAME_PURPLE.1, GAME_PURPLE.2)
}
