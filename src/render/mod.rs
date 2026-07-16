use anyhow::{anyhow, Context, Result};
use base64::{engine::general_purpose::STANDARD as BASE64, Engine};
use dashmap::DashMap;
use std::sync::Arc;
use takumi::prelude::*;
use takumi::{from_html, render, write_image};

const BG: &[u8] = include_bytes!("../../assets/images/gacha/background.png");
const CHARA_BG: &[u8] = include_bytes!("../../assets/images/gacha/chara-card-bg.png");
const PICKUP: &[u8] = include_bytes!("../../assets/images/gacha/pickup.png");
const STAR: &[u8] = include_bytes!("../../assets/images/gacha/star.png");
const POINTS_ICON: &[u8] = include_bytes!("../../assets/images/gacha/points-icon.png");
const FONT_400: &[u8] = include_bytes!("../../assets/fonts/notosans-400.ttf");
const FONT_700: &[u8] = include_bytes!("../../assets/fonts/notosans-700.ttf");

const ICON_CDN: &str = "https://aronabot.cdn.nimblebun.works/v2/images/students/icons";

#[derive(Clone)]
pub struct GachaRenderer {
    fonts: Arc<Fonts>,
    icon_cache: Arc<DashMap<String, String>>,
    http: reqwest::Client,
}

#[derive(Debug, Clone)]
pub struct CardInput {
    pub student_id: String,
    pub rarity: i32,
    pub is_pickup: bool,
}

impl GachaRenderer {
    pub fn new() -> Result<Self> {
        let mut fonts = Fonts::default();
        fonts
            .register(
                FontResource::new(FONT_400.to_vec()).override_info(FontOverride {
                    family_name: Some(std::sync::Arc::from("NotoSans")),
                    weight: Some(400.0),
                    ..Default::default()
                }),
            )
            .context("register NotoSans 400")?;
        fonts
            .register(
                FontResource::new(FONT_700.to_vec()).override_info(FontOverride {
                    family_name: Some(std::sync::Arc::from("NotoSansBold")),
                    weight: Some(700.0),
                    ..Default::default()
                }),
            )
            .context("register NotoSans 700")?;

        Ok(Self {
            fonts: Arc::new(fonts),
            icon_cache: Arc::new(DashMap::new()),
            http: reqwest::Client::new(),
        })
    }

    fn data_uri(bytes: &[u8], mime: &str) -> String {
        format!("data:{mime};base64,{}", BASE64.encode(bytes))
    }

    async fn icon_data_uri(&self, student_id: &str) -> Result<String> {
        if let Some(cached) = self.icon_cache.get(student_id) {
            return Ok(cached.clone());
        }

        let url = format!("{ICON_CDN}/{student_id}.png");
        let bytes = self
            .http
            .get(&url)
            .send()
            .await
            .with_context(|| format!("fetch icon {url}"))?
            .error_for_status()
            .with_context(|| format!("icon status {url}"))?
            .bytes()
            .await?;

        let uri = Self::data_uri(&bytes, "image/png");
        self.icon_cache
            .insert(student_id.to_string(), uri.clone());
        Ok(uri)
    }

    fn box_shadow_for_rarity(rarity: i32) -> &'static str {
        match rarity {
            2 => "0 4px 4px 1px #f3e7ad, 0 0px 5px 4px #faf7c5",
            3 => "0 4px 4px 1px #c5a7ee, 0 0px 5px 4px #fadbed",
            _ => "0 4px 4px 1px rgb(187, 199, 209)",
        }
    }

    fn icon_bg_for_rarity(rarity: i32) -> &'static str {
        match rarity {
            2 => "rgba(252, 245, 120, 0.9)",
            3 => "rgba(249, 195, 219, 0.85)",
            _ => "transparent",
        }
    }

    fn shadow_bg_for_rarity(rarity: i32) -> &'static str {
        match rarity {
            2 => {
                "linear-gradient(to top, rgba(255,255,255,0) 12.5%, rgba(250,250,250,0.3) 25%, rgba(245,245,245,0.7) 45%, rgba(255,255,255,0.9) 50%, rgba(245,245,245,0.7) 55%, rgba(250,250,250,0.3) 75%, rgba(255,255,255,0) 87.5%)"
            }
            3 => {
                "linear-gradient(to top, rgba(211,225,250,0.2), rgba(245,228,252,0.65) 20%, rgba(250,250,250,0.9) 40%, rgba(255,255,255,1) 50%, rgba(250,250,250,0.9) 60%, rgba(245,228,252,0.65) 80%, rgba(211,225,250,0.2))"
            }
            _ => "transparent",
        }
    }

    fn card_shadow_html(rarity: i32) -> String {
        format!(
            r#"<div style="width:115px;height:140px;transform:skewX(-10deg);margin:25px 15px;position:relative;display:flex;justify-content:center;align-items:center;">
                <div style="position:absolute;width:137px;height:400px;background:{};"></div>
            </div>"#,
            Self::shadow_bg_for_rarity(rarity)
        )
    }

    fn card_html(
        icon_uri: &str,
        chara_bg: &str,
        star_uri: &str,
        pickup_uri: &str,
        rarity: i32,
        is_pickup: bool,
    ) -> String {
        let stars: String = (0..rarity)
            .map(|_| {
                format!(
                    r#"<img src="{star_uri}" style="width:20px;transform:skewX(10deg);" />"#
                )
            })
            .collect();

        let pickup = if is_pickup {
            format!(
                r#"<img src="{pickup_uri}" style="position:absolute;left:-10px;top:-10px;height:20px;transform:skewX(10deg);" />"#
            )
        } else {
            String::new()
        };

        format!(
            r#"<div style="width:115px;height:140px;transform:skewX(-10deg);margin:25px 15px;position:relative;display:flex;">
                <div style="position:absolute;top:0;left:0;right:0;bottom:0;border-radius:4px;box-shadow:{};"></div>
                <div style="position:relative;width:100%;height:110px;border:2px solid white;border-radius:4px;overflow:hidden;display:flex;">
                    <div style="position:absolute;top:-4px;left:-12px;width:134px;transform:skewX(10deg);height:110px;background-image:url({chara_bg});background-size:134px 110px;"></div>
                    <img src="{icon_uri}" style="position:relative;flex-shrink:0;top:0;left:-13px;width:138px;max-width:138px;transform:skewX(10deg);background:{};" />
                    <div style="position:absolute;top:-2px;left:-2px;right:-2px;bottom:-2px;border:2px solid white;"></div>
                </div>
                <div style="position:absolute;right:0;bottom:0;width:115px;height:32px;background:rgb(98,112,130);border:2px solid white;border-radius:4px;box-sizing:content-box;display:flex;justify-content:center;align-items:center;">
                    {stars}
                </div>
                {pickup}
            </div>"#,
            Self::box_shadow_for_rarity(rarity),
            Self::icon_bg_for_rarity(rarity),
        )
    }

    fn points_html(points: i64, points_icon: &str) -> String {
        format!(
            r#"<div style="display:flex;flex-direction:row-reverse;justify-content:center;align-items:center;position:absolute;right:55px;bottom:47px;">
                <div style="display:flex;flex-direction:column;width:150px;height:54px;transform:skewX(-10deg);background:#245a7e;border:1px solid #245a7e;border-radius:3px;margin-left:-17px;color:#4b709b;font-size:18px;font-weight:700;font-family:NotoSansBold;text-align:center;position:relative;">
                    <div style="position:absolute;left:0;top:0;width:100%;height:50%;background:white;"></div>
                    <div style="display:flex;justify-content:center;align-items:center;height:50%;font-size:13px;transform:skewX(10deg);position:relative;">Recruitment Points</div>
                    <div style="display:flex;justify-content:center;align-items:center;height:50%;color:white;transform:skewX(10deg);position:relative;">{points}</div>
                </div>
                <img src="{points_icon}" style="width:57px;" />
            </div>"#
        )
    }

    pub async fn render(&self, cards: &[CardInput], points: Option<i64>) -> Result<Vec<u8>> {
        let bg = Self::data_uri(BG, "image/png");
        let chara_bg = Self::data_uri(CHARA_BG, "image/png");
        let star_uri = Self::data_uri(STAR, "image/png");
        let pickup_uri = Self::data_uri(PICKUP, "image/png");
        let points_icon = Self::data_uri(POINTS_ICON, "image/png");

        let mut shadows = String::new();
        let mut card_htmls = String::new();

        for card in cards {
            let icon = self.icon_data_uri(&card.student_id).await?;
            shadows.push_str(&Self::card_shadow_html(card.rarity));
            card_htmls.push_str(&Self::card_html(
                &icon,
                &chara_bg,
                &star_uri,
                &pickup_uri,
                card.rarity,
                card.is_pickup,
            ));
        }

        let points_section = points
            .map(|p| Self::points_html(p, &points_icon))
            .unwrap_or_default();

        let html = format!(
            r#"<div style="overflow:hidden;width:1120px;height:640px;background-size:cover;position:relative;display:flex;background:url({bg});font-family:NotoSans;">
                <div style="position:absolute;top:0;left:0;height:530px;width:1120px;display:flex;justify-content:center;align-content:center;flex-wrap:wrap;padding:0 190px;">
                    {shadows}
                </div>
                <div style="height:570px;display:flex;justify-content:center;align-content:center;flex-wrap:wrap;padding:0 190px;">
                    {card_htmls}
                </div>
                {points_section}
            </div>"#
        );

        let node = from_html(&html, FromHtmlOptions::default())
            .map_err(|e| anyhow!("takumi from_html: {e}"))?;

        let options = RenderOptions::builder()
            .viewport(Viewport::new((1120, 640)))
            .node(node)
            .fonts(self.fonts.as_ref())
            .build();

        let image = render(options).map_err(|e| anyhow!("takumi render: {e}"))?;

        let mut png = Vec::new();
        write_image(&image, &mut png, OutputFormat::Png)
            .map_err(|e| anyhow!("encode png: {e}"))?;
        Ok(png)
    }
}

impl Default for GachaRenderer {
    fn default() -> Self {
        Self::new().expect("GachaRenderer")
    }
}
