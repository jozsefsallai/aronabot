use crate::gacha::banner::GachaBanner;

#[derive(Debug, Default)]
pub struct BannerContainer {
    banners: Vec<GachaBanner>,
}

impl BannerContainer {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn reload(&mut self, banners: Vec<GachaBanner>) {
        self.banners = banners;
    }

    pub fn all(&self) -> &[GachaBanner] {
        &self.banners
    }

    pub fn get_banner(&self, id: &str) -> Option<&GachaBanner> {
        self.banners.iter().find(|b| b.id == id)
    }
}
