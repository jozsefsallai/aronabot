use crate::db::models::DetailedGift;

#[derive(Debug, Default)]
pub struct GiftContainer {
    gifts: Vec<DetailedGift>,
}

impl GiftContainer {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn reload(&mut self, gifts: Vec<DetailedGift>) {
        self.gifts = gifts;
    }

    pub fn get_gifts(&self) -> &[DetailedGift] {
        &self.gifts
    }

    pub fn get_gift_with_name(&self, name: &str) -> Option<&DetailedGift> {
        self.gifts
            .iter()
            .find(|g| g.name.eq_ignore_ascii_case(name))
    }

    pub fn find_many_by_name(&self, name: &str) -> Vec<&DetailedGift> {
        let lower = name.to_lowercase();
        self.gifts
            .iter()
            .filter(|g| g.name.to_lowercase().contains(&lower))
            .collect()
    }
}
