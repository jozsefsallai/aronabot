use crate::db::models::Mission;

#[derive(Debug, Default)]
pub struct MissionContainer {
    missions: Vec<Mission>,
}

impl MissionContainer {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn reload(&mut self, missions: Vec<Mission>) {
        self.missions = missions;
    }

    pub fn get_missions(&self) -> &[Mission] {
        &self.missions
    }

    pub fn get_mission_with_name(&self, name: &str) -> Option<&Mission> {
        let final_name = name
            .to_uppercase()
            .replace(char::is_whitespace, "")
            .replace("HARD", "H");
        self.missions.iter().find(|m| m.name == final_name)
    }
}
