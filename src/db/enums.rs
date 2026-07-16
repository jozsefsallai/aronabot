use serde::{Deserialize, Serialize};
use sqlx::Type;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, Type)]
#[sqlx(type_name = "School", rename_all = "PascalCase")]
pub enum School {
    Abydos,
    Arius,
    Gehenna,
    Hyakkiyako,
    Millennium,
    RedWinter,
    Shanhaijing,
    #[sqlx(rename = "SRT")]
    SRT,
    Trinity,
    Valkyrie,
    Highlander,
    WildHunt,
    #[sqlx(rename = "ETC")]
    ETC,
    Tokiwadai,
    Sakugawa,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, Type)]
#[sqlx(type_name = "Club", rename_all = "PascalCase")]
pub enum Club {
    #[sqlx(rename = "Kohshinjo68")]
    Kohshinjo68,
    Justice,
    CleanNClearing,
    BookClub,
    Countermeasure,
    Engineer,
    FoodService,
    Fuuki,
    GourmetClub,
    HoukagoDessert,
    KnightsHospitaller,
    MatsuriOffice,
    Meihuayuan,
    Onmyobu,
    RemedialClass,
    #[sqlx(rename = "SPTF")]
    SPTF,
    Shugyobu,
    Endanbou,
    TheSeminar,
    TrainingClub,
    TrinityVigilance,
    Veritas,
    NinpoKenkyubu,
    GameDev,
    RedwinterSecretary,
    #[sqlx(rename = "anzenkyoku")]
    Anzenkyoku,
    SisterHood,
    #[sqlx(rename = "Class227")]
    Class227,
    Emergentology,
    RabbitPlatoon,
    PandemoniumSociety,
    AriusSqud,
    HotSpringsDepartment,
    TeaParty,
    PublicPeaceBureau,
    BlackTortoisePromenade,
    Genryumon,
    LaborParty,
    KnowledgeLiberationFront,
    Hyakkayouran,
    ShinySparkleSociety,
    AbydosStudentCouncil,
    CentralControlCenter,
    FreightLogisticsDepartment,
    OccultClub,
    FreeTradeCartel,
    NicomediasTroop,
    PublishingDepartment,
    FoxSquad,
    EmptyClub,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, Type)]
#[sqlx(type_name = "CombatClass", rename_all = "PascalCase")]
pub enum CombatClass {
    Main,
    Support,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, Type)]
#[sqlx(type_name = "AttackType", rename_all = "PascalCase")]
pub enum AttackType {
    Explosion,
    Pierce,
    Mystic,
    Normal,
    Sonic,
    Chemical,
    Mixed,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, Type)]
#[sqlx(type_name = "DefenseType", rename_all = "PascalCase")]
pub enum DefenseType {
    LightArmor,
    HeavyArmor,
    Unarmed,
    ElasticArmor,
    CompositeArmor,
    Normal,
    Mixed,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, Type)]
#[sqlx(type_name = "CombatRole", rename_all = "PascalCase")]
pub enum CombatRole {
    DamageDealer,
    Tanker,
    Healer,
    Supporter,
    Vehicle,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, Type)]
#[sqlx(type_name = "CombatPosition", rename_all = "PascalCase")]
pub enum CombatPosition {
    Back,
    Front,
    Middle,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, Type)]
#[sqlx(type_name = "WeaponType", rename_all = "PascalCase")]
pub enum WeaponType {
    #[sqlx(rename = "SR")]
    SR,
    #[sqlx(rename = "SG")]
    SG,
    #[sqlx(rename = "AR")]
    AR,
    #[sqlx(rename = "MG")]
    MG,
    #[sqlx(rename = "SMG")]
    SMG,
    #[sqlx(rename = "RG")]
    RG,
    #[sqlx(rename = "HG")]
    HG,
    #[sqlx(rename = "GL")]
    GL,
    #[sqlx(rename = "RL")]
    RL,
    #[sqlx(rename = "FT")]
    FT,
    #[sqlx(rename = "MT")]
    MT,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, Type)]
#[sqlx(type_name = "EquipmentKind", rename_all = "PascalCase")]
pub enum EquipmentKind {
    Hat,
    Hairpin,
    Watch,
    Shoes,
    Bag,
    Charm,
    Necklace,
    Gloves,
    Badge,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, Type)]
#[sqlx(type_name = "Terrain", rename_all = "PascalCase")]
pub enum Terrain {
    Street,
    Outdoor,
    Indoor,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, Type)]
#[sqlx(type_name = "SkillType", rename_all = "PascalCase")]
pub enum SkillType {
    #[sqlx(rename = "EX")]
    EX,
    Basic,
    Enhanced,
    Sub,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, Type)]
#[sqlx(type_name = "ItemRarity", rename_all = "PascalCase")]
pub enum ItemRarity {
    #[sqlx(rename = "N")]
    N,
    #[sqlx(rename = "R")]
    R,
    #[sqlx(rename = "SR")]
    SR,
    #[sqlx(rename = "SSR")]
    SSR,
}

impl std::fmt::Display for ItemRarity {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::N => write!(f, "N"),
            Self::R => write!(f, "R"),
            Self::SR => write!(f, "SR"),
            Self::SSR => write!(f, "SSR"),
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, Type)]
#[sqlx(type_name = "MissionDifficulty", rename_all = "PascalCase")]
pub enum MissionDifficulty {
    Normal,
    Hard,
}

impl std::fmt::Display for MissionDifficulty {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Normal => write!(f, "Normal"),
            Self::Hard => write!(f, "Hard"),
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize, Type)]
#[sqlx(type_name = "BannerKind", rename_all = "PascalCase")]
pub enum BannerKind {
    Global,
    #[sqlx(rename = "JP")]
    JP,
}

impl BannerKind {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Global => "Global",
            Self::JP => "JP",
        }
    }
}

impl std::fmt::Display for BannerKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.as_str())
    }
}

impl std::str::FromStr for BannerKind {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "Global" => Ok(Self::Global),
            "JP" => Ok(Self::JP),
            other => Err(format!("Unknown BannerKind: {other}")),
        }
    }
}
