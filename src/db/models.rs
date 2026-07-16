use super::enums::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Student {
    pub id: String,
    pub dev_name: String,
    pub schale_db_id: i32,
    pub default_order: i32,
    pub name: String,
    pub last_name: String,
    pub first_name: String,
    pub name_jp: String,
    pub last_name_jp: String,
    pub first_name_jp: String,
    pub school: School,
    pub club: Club,
    pub age: String,
    pub birthday: String,
    pub introduction: Option<String>,
    pub hobbies: Option<String>,
    pub voice_actor: Option<String>,
    pub illustrator: Option<String>,
    pub designer: Option<String>,
    pub height: Option<String>,
    pub memorobi_level: i32,
    pub combat_class: CombatClass,
    pub combat_role: CombatRole,
    pub combat_position: CombatPosition,
    pub attack_type: AttackType,
    pub defense_type: DefenseType,
    pub street_battle_adaptation: i32,
    pub outdoor_battle_adaptation: i32,
    pub indoor_battle_adaptation: i32,
    pub weapon_type: WeaponType,
    pub uses_cover: bool,
    pub equipment: Vec<EquipmentKind>,
    pub has_bond_gear_jp: bool,
    pub has_bond_gear_global: bool,
    pub has_bond_gear_cn: bool,
    pub rarity: i32,
    pub is_released_jp: bool,
    pub is_released_global: bool,
    pub is_released_cn: bool,
    pub is_welfare_jp: bool,
    pub is_welfare_global: bool,
    pub is_welfare_cn: bool,
    pub is_limited_jp: bool,
    pub is_limited_global: bool,
    pub is_limited_cn: bool,
    pub is_fest_jp: bool,
    pub is_fest_global: bool,
    pub is_fest_cn: bool,
    pub is_archive_jp: bool,
    pub is_archive_global: bool,
    pub is_archive_cn: bool,
    pub search_tags: Vec<String>,
    pub base_variant_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Skill {
    pub id: i32,
    pub r#type: SkillType,
    pub name: String,
    pub description: String,
    pub cost: Option<String>,
    pub student_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Gift {
    pub id: i32,
    pub name: String,
    pub name_jp: String,
    pub description: Option<String>,
    pub description_jp: Option<String>,
    pub rarity: ItemRarity,
    pub exp_value: i32,
    pub icon_name: String,
    pub is_loved_by_everyone: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Mission {
    pub id: i32,
    pub name: String,
    pub cost: i32,
    pub difficulty: Option<MissionDifficulty>,
    pub terrain: Option<Terrain>,
    pub recommended_level: i32,
    pub drops: Vec<String>,
    pub stage_image_url: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct BannerRow {
    pub id: String,
    pub name: String,
    pub sort_key: i32,
    pub date: String,
    pub three_star_rate: i32,
    pub pickup_rate: i32,
    pub extra_rate: i32,
    pub base_one_star_rate: i32,
    pub base_two_star_rate: i32,
    pub base_three_star_rate: i32,
    pub kind: BannerKind,
}

#[derive(Debug, Clone)]
pub struct DetailedStudent {
    pub student: Student,
    pub skills: Vec<Skill>,
    pub gifts_adored: Vec<Gift>,
    pub gifts_loved: Vec<Gift>,
    pub gifts_liked: Vec<Gift>,
}

impl DetailedStudent {
    pub fn id(&self) -> &str {
        &self.student.id
    }

    pub fn name(&self) -> &str {
        &self.student.name
    }

    pub fn rarity(&self) -> i32 {
        self.student.rarity
    }
}

impl std::ops::Deref for DetailedStudent {
    type Target = Student;

    fn deref(&self) -> &Self::Target {
        &self.student
    }
}

#[derive(Debug, Clone)]
pub struct DetailedGift {
    pub gift: Gift,
    pub adored_by: Vec<Student>,
    pub loved_by: Vec<Student>,
    pub liked_by: Vec<Student>,
}

impl std::ops::Deref for DetailedGift {
    type Target = Gift;

    fn deref(&self) -> &Self::Target {
        &self.gift
    }
}

#[derive(Debug, Clone)]
pub struct DetailedBanner {
    pub banner: BannerRow,
    pub pickup_pool_students: Vec<Student>,
    pub extra_pool_students: Vec<Student>,
    pub additional_three_star_students: Vec<Student>,
}
