use crate::db::enums::*;

/// Look up an EN localization string by dotted key (e.g. `"school.Abydos"`).
/// Returns `"No LocalizeKey {key}"` when the key is missing.
pub fn t(key: &str) -> String {
    let Some((category, name)) = key.split_once('.') else {
        return format!("No LocalizeKey {key}");
    };

    let value = match (category, name) {
        // combatClass
        ("combatClass", "Main") => Some("Striker"),
        ("combatClass", "Support") => Some("Special"),

        // attackType
        ("attackType", "Explosion") => Some("Explosive"),
        ("attackType", "Pierce") => Some("Piercing"),
        ("attackType", "Mystic") => Some("Mystic"),
        ("attackType", "Normal") => Some("Normal"),
        ("attackType", "Sonic") => Some("Sonic"),
        ("attackType", "Chemical") => Some("Corrosive"),
        ("attackType", "Mixed") => Some("Mixed"),

        // defenseType
        ("defenseType", "LightArmor") => Some("Light"),
        ("defenseType", "HeavyArmor") => Some("Heavy"),
        ("defenseType", "Unarmed") => Some("Special"),
        ("defenseType", "ElasticArmor") => Some("Elastic"),
        ("defenseType", "CompositeArmor") => Some("Composite"),
        ("defenseType", "Normal") => Some("Normal"),
        ("defenseType", "Mixed") => Some("Mixed"),

        // combatRole
        ("combatRole", "DamageDealer") => Some("Dealer"),
        ("combatRole", "Tanker") => Some("Tank"),
        ("combatRole", "Healer") => Some("Healer"),
        ("combatRole", "Supporter") => Some("Support"),
        ("combatRole", "Vehicle") => Some("T.S."),

        // combatPosition
        ("combatPosition", "Back") => Some("Back"),
        ("combatPosition", "Front") => Some("Front"),
        ("combatPosition", "Middle") => Some("Middle"),

        // skillType
        ("skillType", "EX") => Some("EX"),
        ("skillType", "Basic") => Some("Basic"),
        ("skillType", "Enhanced") => Some("Enhanced"),
        ("skillType", "Sub") => Some("Sub"),

        // school
        ("school", "Abydos") => Some("Abydos High School"),
        ("school", "Arius") => Some("Arius Satellite School"),
        ("school", "Gehenna") => Some("Gehenna Academy"),
        ("school", "Hyakkiyako") => Some("Allied Hyakkiyako Academy"),
        ("school", "Millennium") => Some("Millennium Science School"),
        ("school", "RedWinter") => Some("Red Winter Federal Academy"),
        ("school", "Shanhaijing") => Some("Shanhaijing Academy"),
        ("school", "SRT") => Some("SRT Academy"),
        ("school", "Trinity") => Some("Trinity General School"),
        ("school", "Valkyrie") => Some("Valkyrie Police School"),
        ("school", "Highlander") => Some("Highlander Railroad Academy"),
        ("school", "WildHunt") => Some("Wildhunt Art Academy"),
        ("school", "ETC") => Some("ETC"),
        ("school", "Tokiwadai") => Some("Tokiwadai Middle School"),
        ("school", "Sakugawa") => Some("Sakugawa Middle School"),

        // terrain
        ("terrain", "Street") => Some("Urban"),
        ("terrain", "Outdoor") => Some("Field"),
        ("terrain", "Indoor") => Some("Indoor"),

        // weaponType
        ("weaponType", "SR") => Some("Sniper Rifle"),
        ("weaponType", "SG") => Some("Shotgun"),
        ("weaponType", "AR") => Some("Assault Rifle"),
        ("weaponType", "MG") => Some("Machine Gun"),
        ("weaponType", "SMG") => Some("Submachine Gun"),
        ("weaponType", "RG") => Some("Railgun"),
        ("weaponType", "HG") => Some("Handgun"),
        ("weaponType", "GL") => Some("Grenade Launcher"),
        ("weaponType", "RL") => Some("Rocket Launcher"),
        ("weaponType", "FT") => Some("Flamethrower"),
        ("weaponType", "MT") => Some("Mortar"),

        // club
        ("club", "Kohshinjo68") => Some("Problem Solver 68"),
        ("club", "Justice") => Some("Justice Task Force"),
        ("club", "CleanNClearing") => Some("Cleaning & Clearing"),
        ("club", "BookClub") => Some("Library Committee"),
        ("club", "Countermeasure") => Some("Foreclosure Task Force"),
        ("club", "Engineer") => Some("Engineering Department"),
        ("club", "FoodService") => Some("School Lunch Club"),
        ("club", "Fuuki") => Some("Prefect Team"),
        ("club", "GourmetClub") => Some("Gourmet Research Society"),
        ("club", "HoukagoDessert") => Some("After-School Sweets Club"),
        ("club", "KnightsHospitaller") => Some("Remedial Knights"),
        ("club", "MatsuriOffice") => Some("Festival Operations Department"),
        ("club", "Meihuayuan") => Some("Plum Blossom Garden"),
        ("club", "Onmyobu") => Some("Yin-Yang Club"),
        ("club", "RemedialClass") => Some("Make-Up Work Club"),
        ("club", "SPTF") => Some("Super Phenomenon Task Force"),
        ("club", "Shugyobu") => Some("Inner Discipline Club"),
        ("club", "Endanbou") => Some("Eastern Alchemy Society"),
        ("club", "TheSeminar") => Some("Seminar"),
        ("club", "TrainingClub") => Some("Athletics Training Club"),
        ("club", "TrinityVigilance") => Some("Trinity's Vigilante Crew"),
        ("club", "Veritas") => Some("Veritas"),
        ("club", "NinpoKenkyubu") => Some("Ninjutsu Research Club"),
        ("club", "GameDev") => Some("Game Development Department"),
        ("club", "RedwinterSecretary") => Some("Red Winter Office"),
        ("club", "anzenkyoku") => Some("Public Safety Bureau"),
        ("club", "SisterHood") => Some("The Sisterhood"),
        ("club", "Class227") => Some("Spec Ops No. 227"),
        ("club", "Emergentology") => Some("Medical Emergency Club"),
        ("club", "RabbitPlatoon") => Some("RABBIT Squad"),
        ("club", "PandemoniumSociety") => Some("Pandemonium Society"),
        ("club", "AriusSqud") => Some("Arius Squad"),
        ("club", "HotSpringsDepartment") => Some("Hot Springs Department"),
        ("club", "TeaParty") => Some("Tea Party"),
        ("club", "PublicPeaceBureau") => Some("Public Peace Bureau"),
        ("club", "BlackTortoisePromenade") => Some("Black Tortoise Promenade"),
        ("club", "Genryumon") => Some("Genryumon"),
        ("club", "LaborParty") => Some("Labor Party"),
        ("club", "KnowledgeLiberationFront") => Some("Knowledge Liberation Front"),
        ("club", "Hyakkayouran") => Some("Hyakkaryouran Resolution Council"),
        ("club", "ShinySparkleSociety") => Some("Sparkle Club"),
        ("club", "AbydosStudentCouncil") => Some("Abydos Student Council"),
        ("club", "CentralControlCenter") => Some("Central Control Center"),
        ("club", "FreightLogisticsDepartment") => Some("Freight Logistics Department"),
        ("club", "OccultClub") => Some("Occult Research Society"),
        ("club", "FreeTradeCartel") => Some("Special Trade Department"),
        ("club", "NicomediasTroop") => Some("Nicomedia Troop"),
        ("club", "PublishingDepartment") => Some("Publishing Department"),
        ("club", "FoxSquad") => Some("FOX Squad"),
        ("club", "EmptyClub") => Some("None"),

        _ => None,
    };

    match value {
        Some(s) => s.to_string(),
        None => format!("No LocalizeKey {key}"),
    }
}

pub fn combat_class(value: CombatClass) -> String {
    match value {
        CombatClass::Main => t("combatClass.Main"),
        CombatClass::Support => t("combatClass.Support"),
    }
}

pub fn attack_type(value: AttackType) -> String {
    match value {
        AttackType::Explosion => t("attackType.Explosion"),
        AttackType::Pierce => t("attackType.Pierce"),
        AttackType::Mystic => t("attackType.Mystic"),
        AttackType::Normal => t("attackType.Normal"),
        AttackType::Sonic => t("attackType.Sonic"),
        AttackType::Chemical => t("attackType.Chemical"),
        AttackType::Mixed => t("attackType.Mixed"),
    }
}

pub fn defense_type(value: DefenseType) -> String {
    match value {
        DefenseType::LightArmor => t("defenseType.LightArmor"),
        DefenseType::HeavyArmor => t("defenseType.HeavyArmor"),
        DefenseType::Unarmed => t("defenseType.Unarmed"),
        DefenseType::ElasticArmor => t("defenseType.ElasticArmor"),
        DefenseType::CompositeArmor => t("defenseType.CompositeArmor"),
        DefenseType::Normal => t("defenseType.Normal"),
        DefenseType::Mixed => t("defenseType.Mixed"),
    }
}

pub fn combat_role(value: CombatRole) -> String {
    match value {
        CombatRole::DamageDealer => t("combatRole.DamageDealer"),
        CombatRole::Tanker => t("combatRole.Tanker"),
        CombatRole::Healer => t("combatRole.Healer"),
        CombatRole::Supporter => t("combatRole.Supporter"),
        CombatRole::Vehicle => t("combatRole.Vehicle"),
    }
}

pub fn combat_position(value: CombatPosition) -> String {
    match value {
        CombatPosition::Back => t("combatPosition.Back"),
        CombatPosition::Front => t("combatPosition.Front"),
        CombatPosition::Middle => t("combatPosition.Middle"),
    }
}

pub fn skill_type(value: SkillType) -> String {
    match value {
        SkillType::EX => t("skillType.EX"),
        SkillType::Basic => t("skillType.Basic"),
        SkillType::Enhanced => t("skillType.Enhanced"),
        SkillType::Sub => t("skillType.Sub"),
    }
}

pub fn school(value: School) -> String {
    match value {
        School::Abydos => t("school.Abydos"),
        School::Arius => t("school.Arius"),
        School::Gehenna => t("school.Gehenna"),
        School::Hyakkiyako => t("school.Hyakkiyako"),
        School::Millennium => t("school.Millennium"),
        School::RedWinter => t("school.RedWinter"),
        School::Shanhaijing => t("school.Shanhaijing"),
        School::SRT => t("school.SRT"),
        School::Trinity => t("school.Trinity"),
        School::Valkyrie => t("school.Valkyrie"),
        School::Highlander => t("school.Highlander"),
        School::WildHunt => t("school.WildHunt"),
        School::ETC => t("school.ETC"),
        School::Tokiwadai => t("school.Tokiwadai"),
        School::Sakugawa => t("school.Sakugawa"),
    }
}

pub fn terrain(value: Terrain) -> String {
    match value {
        Terrain::Street => t("terrain.Street"),
        Terrain::Outdoor => t("terrain.Outdoor"),
        Terrain::Indoor => t("terrain.Indoor"),
    }
}

pub fn weapon_type(value: WeaponType) -> String {
    match value {
        WeaponType::SR => t("weaponType.SR"),
        WeaponType::SG => t("weaponType.SG"),
        WeaponType::AR => t("weaponType.AR"),
        WeaponType::MG => t("weaponType.MG"),
        WeaponType::SMG => t("weaponType.SMG"),
        WeaponType::RG => t("weaponType.RG"),
        WeaponType::HG => t("weaponType.HG"),
        WeaponType::GL => t("weaponType.GL"),
        WeaponType::RL => t("weaponType.RL"),
        WeaponType::FT => t("weaponType.FT"),
        WeaponType::MT => t("weaponType.MT"),
    }
}

pub fn club(value: Club) -> String {
    match value {
        Club::Kohshinjo68 => t("club.Kohshinjo68"),
        Club::Justice => t("club.Justice"),
        Club::CleanNClearing => t("club.CleanNClearing"),
        Club::BookClub => t("club.BookClub"),
        Club::Countermeasure => t("club.Countermeasure"),
        Club::Engineer => t("club.Engineer"),
        Club::FoodService => t("club.FoodService"),
        Club::Fuuki => t("club.Fuuki"),
        Club::GourmetClub => t("club.GourmetClub"),
        Club::HoukagoDessert => t("club.HoukagoDessert"),
        Club::KnightsHospitaller => t("club.KnightsHospitaller"),
        Club::MatsuriOffice => t("club.MatsuriOffice"),
        Club::Meihuayuan => t("club.Meihuayuan"),
        Club::Onmyobu => t("club.Onmyobu"),
        Club::RemedialClass => t("club.RemedialClass"),
        Club::SPTF => t("club.SPTF"),
        Club::Shugyobu => t("club.Shugyobu"),
        Club::Endanbou => t("club.Endanbou"),
        Club::TheSeminar => t("club.TheSeminar"),
        Club::TrainingClub => t("club.TrainingClub"),
        Club::TrinityVigilance => t("club.TrinityVigilance"),
        Club::Veritas => t("club.Veritas"),
        Club::NinpoKenkyubu => t("club.NinpoKenkyubu"),
        Club::GameDev => t("club.GameDev"),
        Club::RedwinterSecretary => t("club.RedwinterSecretary"),
        Club::Anzenkyoku => t("club.anzenkyoku"),
        Club::SisterHood => t("club.SisterHood"),
        Club::Class227 => t("club.Class227"),
        Club::Emergentology => t("club.Emergentology"),
        Club::RabbitPlatoon => t("club.RabbitPlatoon"),
        Club::PandemoniumSociety => t("club.PandemoniumSociety"),
        Club::AriusSqud => t("club.AriusSqud"),
        Club::HotSpringsDepartment => t("club.HotSpringsDepartment"),
        Club::TeaParty => t("club.TeaParty"),
        Club::PublicPeaceBureau => t("club.PublicPeaceBureau"),
        Club::BlackTortoisePromenade => t("club.BlackTortoisePromenade"),
        Club::Genryumon => t("club.Genryumon"),
        Club::LaborParty => t("club.LaborParty"),
        Club::KnowledgeLiberationFront => t("club.KnowledgeLiberationFront"),
        Club::Hyakkayouran => t("club.Hyakkayouran"),
        Club::ShinySparkleSociety => t("club.ShinySparkleSociety"),
        Club::AbydosStudentCouncil => t("club.AbydosStudentCouncil"),
        Club::CentralControlCenter => t("club.CentralControlCenter"),
        Club::FreightLogisticsDepartment => t("club.FreightLogisticsDepartment"),
        Club::OccultClub => t("club.OccultClub"),
        Club::FreeTradeCartel => t("club.FreeTradeCartel"),
        Club::NicomediasTroop => t("club.NicomediasTroop"),
        Club::PublishingDepartment => t("club.PublishingDepartment"),
        Club::FoxSquad => t("club.FoxSquad"),
        Club::EmptyClub => t("club.EmptyClub"),
    }
}
