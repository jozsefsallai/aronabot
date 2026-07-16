use super::models::*;
use anyhow::Result;
use sqlx::PgPool;
use std::collections::HashMap;

const STUDENT_SELECT: &str = r#"
    id,
    "devName" as dev_name,
    "schaleDbId" as schale_db_id,
    "defaultOrder" as default_order,
    name,
    "lastName" as last_name,
    "firstName" as first_name,
    "nameJP" as name_jp,
    "lastNameJP" as last_name_jp,
    "firstNameJP" as first_name_jp,
    school,
    club,
    age,
    birthday,
    introduction,
    hobbies,
    "voiceActor" as voice_actor,
    illustrator,
    designer,
    height,
    "memorobiLevel" as memorobi_level,
    "combatClass" as combat_class,
    "combatRole" as combat_role,
    "combatPosition" as combat_position,
    "attackType" as attack_type,
    "defenseType" as defense_type,
    "streetBattleAdaptation" as street_battle_adaptation,
    "outdoorBattleAdaptation" as outdoor_battle_adaptation,
    "indoorBattleAdaptation" as indoor_battle_adaptation,
    "weaponType" as weapon_type,
    "usesCover" as uses_cover,
    equipment,
    "hasBondGearJP" as has_bond_gear_jp,
    "hasBondGearGlobal" as has_bond_gear_global,
    "hasBondGearCN" as has_bond_gear_cn,
    rarity,
    "isReleasedJP" as is_released_jp,
    "isReleasedGlobal" as is_released_global,
    "isReleasedCN" as is_released_cn,
    "isWelfareJP" as is_welfare_jp,
    "isWelfareGlobal" as is_welfare_global,
    "isWelfareCN" as is_welfare_cn,
    "isLimitedJP" as is_limited_jp,
    "isLimitedGlobal" as is_limited_global,
    "isLimitedCN" as is_limited_cn,
    "isFestJP" as is_fest_jp,
    "isFestGlobal" as is_fest_global,
    "isFestCN" as is_fest_cn,
    "isArchiveJP" as is_archive_jp,
    "isArchiveGlobal" as is_archive_global,
    "isArchiveCN" as is_archive_cn,
    "searchTags" as search_tags,
    "baseVariantId" as base_variant_id
"#;

const GIFT_SELECT: &str = r#"
    id,
    name,
    "nameJP" as name_jp,
    description,
    "descriptionJP" as description_jp,
    rarity,
    "expValue" as exp_value,
    "iconName" as icon_name,
    "isLovedByEveryone" as is_loved_by_everyone
"#;

pub async fn load_students(pool: &PgPool) -> Result<Vec<DetailedStudent>> {
    let students: Vec<Student> =
        sqlx::query_as(&format!("SELECT {STUDENT_SELECT} FROM \"Student\""))
            .fetch_all(pool)
            .await?;

    let skills: Vec<Skill> = sqlx::query_as(
        r#"
        SELECT id, type, name, description, cost, "studentId" as student_id
        FROM "Skill"
        "#,
    )
    .fetch_all(pool)
    .await?;

    let mut skills_by_student: HashMap<String, Vec<Skill>> = HashMap::new();
    for skill in skills {
        skills_by_student
            .entry(skill.student_id.clone())
            .or_default()
            .push(skill);
    }

    let adored = load_student_gift_links(pool, "_GiftAdoredBy").await?;
    let loved = load_student_gift_links(pool, "_GiftLovedBy").await?;
    let liked = load_student_gift_links(pool, "_GiftLikedBy").await?;

    let gifts: Vec<Gift> =
        sqlx::query_as(&format!("SELECT {GIFT_SELECT} FROM \"Gift\""))
            .fetch_all(pool)
            .await?;
    let gifts_by_id: HashMap<i32, Gift> = gifts.into_iter().map(|g| (g.id, g)).collect();

    let mut result = Vec::with_capacity(students.len());
    for student in students {
        let gifts_adored = map_gift_ids(&adored, &student.id, &gifts_by_id);
        let gifts_loved = map_gift_ids(&loved, &student.id, &gifts_by_id);
        let gifts_liked = map_gift_ids(&liked, &student.id, &gifts_by_id);
        let skills = skills_by_student.remove(&student.id).unwrap_or_default();

        result.push(DetailedStudent {
            student,
            skills,
            gifts_adored,
            gifts_loved,
            gifts_liked,
        });
    }

    Ok(result)
}

fn map_gift_ids(
    links: &HashMap<String, Vec<i32>>,
    student_id: &str,
    gifts_by_id: &HashMap<i32, Gift>,
) -> Vec<Gift> {
    links
        .get(student_id)
        .into_iter()
        .flatten()
        .filter_map(|id| gifts_by_id.get(id).cloned())
        .collect()
}

/// Prisma M2M `_Gift*` tables: A = Gift.id (Int), B = Student.id (String)
async fn load_student_gift_links(
    pool: &PgPool,
    table: &str,
) -> Result<HashMap<String, Vec<i32>>> {
    #[derive(sqlx::FromRow)]
    struct Link {
        a: i32,
        b: String,
    }

    let rows: Vec<Link> = sqlx::query_as(&format!(r#"SELECT "A" as a, "B" as b FROM "{table}""#))
        .fetch_all(pool)
        .await?;

    let mut map: HashMap<String, Vec<i32>> = HashMap::new();
    for row in rows {
        map.entry(row.b).or_default().push(row.a);
    }
    Ok(map)
}

pub async fn load_gifts(pool: &PgPool) -> Result<Vec<DetailedGift>> {
    let gifts: Vec<Gift> = sqlx::query_as(&format!(
        r#"SELECT {GIFT_SELECT} FROM "Gift" ORDER BY name ASC"#
    ))
    .fetch_all(pool)
    .await?;

    let students: Vec<Student> =
        sqlx::query_as(&format!("SELECT {STUDENT_SELECT} FROM \"Student\""))
            .fetch_all(pool)
            .await?;
    let students_by_id: HashMap<String, Student> =
        students.into_iter().map(|s| (s.id.clone(), s)).collect();

    let adored = load_gift_student_links(pool, "_GiftAdoredBy").await?;
    let loved = load_gift_student_links(pool, "_GiftLovedBy").await?;
    let liked = load_gift_student_links(pool, "_GiftLikedBy").await?;

    let mut result = Vec::with_capacity(gifts.len());
    for gift in gifts {
        let adored_by = map_student_ids(&adored, gift.id, &students_by_id);
        let loved_by = map_student_ids(&loved, gift.id, &students_by_id);
        let liked_by = map_student_ids(&liked, gift.id, &students_by_id);
        result.push(DetailedGift {
            gift,
            adored_by,
            loved_by,
            liked_by,
        });
    }

    Ok(result)
}

fn map_student_ids(
    links: &HashMap<i32, Vec<String>>,
    gift_id: i32,
    students_by_id: &HashMap<String, Student>,
) -> Vec<Student> {
    links
        .get(&gift_id)
        .into_iter()
        .flatten()
        .filter_map(|id| students_by_id.get(id).cloned())
        .collect()
}

async fn load_gift_student_links(
    pool: &PgPool,
    table: &str,
) -> Result<HashMap<i32, Vec<String>>> {
    #[derive(sqlx::FromRow)]
    struct Link {
        a: i32,
        b: String,
    }

    let rows: Vec<Link> = sqlx::query_as(&format!(r#"SELECT "A" as a, "B" as b FROM "{table}""#))
        .fetch_all(pool)
        .await?;

    let mut map: HashMap<i32, Vec<String>> = HashMap::new();
    for row in rows {
        map.entry(row.a).or_default().push(row.b);
    }
    Ok(map)
}

pub async fn load_missions(pool: &PgPool) -> Result<Vec<Mission>> {
    let missions = sqlx::query_as(
        r#"
        SELECT
            id,
            name,
            cost,
            difficulty,
            terrain,
            "recommendedLevel" as recommended_level,
            drops,
            "stageImageUrl" as stage_image_url
        FROM "Mission"
        ORDER BY name ASC
        "#,
    )
    .fetch_all(pool)
    .await?;
    Ok(missions)
}

pub async fn load_banners(pool: &PgPool) -> Result<Vec<DetailedBanner>> {
    let banners: Vec<BannerRow> = sqlx::query_as(
        r#"
        SELECT
            id,
            name,
            "sortKey" as sort_key,
            date,
            "threeStarRate" as three_star_rate,
            "pickupRate" as pickup_rate,
            "extraRate" as extra_rate,
            "baseOneStarRate" as base_one_star_rate,
            "baseTwoStarRate" as base_two_star_rate,
            "baseThreeStarRate" as base_three_star_rate,
            kind
        FROM "Banner"
        ORDER BY "sortKey" ASC
        "#,
    )
    .fetch_all(pool)
    .await?;

    let students: Vec<Student> =
        sqlx::query_as(&format!("SELECT {STUDENT_SELECT} FROM \"Student\""))
            .fetch_all(pool)
            .await?;
    let students_by_id: HashMap<String, Student> =
        students.into_iter().map(|s| (s.id.clone(), s)).collect();

    // Prisma M2M: Banner < Student alphabetically → A = Banner.id, B = Student.id
    let pickup = load_banner_student_links(pool, "_PickupPoolStudents").await?;
    let extra = load_banner_student_links(pool, "_ExtraPoolStudents").await?;
    let additional = load_banner_student_links(pool, "_AdditionalThreeStarStudents").await?;

    let mut result = Vec::with_capacity(banners.len());
    for banner in banners {
        let pickup_pool_students = map_banner_students(&pickup, &banner.id, &students_by_id);
        let extra_pool_students = map_banner_students(&extra, &banner.id, &students_by_id);
        let additional_three_star_students =
            map_banner_students(&additional, &banner.id, &students_by_id);

        result.push(DetailedBanner {
            banner,
            pickup_pool_students,
            extra_pool_students,
            additional_three_star_students,
        });
    }

    Ok(result)
}

fn map_banner_students(
    links: &HashMap<String, Vec<String>>,
    banner_id: &str,
    students_by_id: &HashMap<String, Student>,
) -> Vec<Student> {
    links
        .get(banner_id)
        .into_iter()
        .flatten()
        .filter_map(|id| students_by_id.get(id).cloned())
        .collect()
}

async fn load_banner_student_links(
    pool: &PgPool,
    table: &str,
) -> Result<HashMap<String, Vec<String>>> {
    #[derive(sqlx::FromRow)]
    struct Link {
        a: String,
        b: String,
    }

    let rows: Vec<Link> = sqlx::query_as(&format!(r#"SELECT "A" as a, "B" as b FROM "{table}""#))
        .fetch_all(pool)
        .await?;

    let mut map: HashMap<String, Vec<String>> = HashMap::new();
    for row in rows {
        map.entry(row.a).or_default().push(row.b);
    }
    Ok(map)
}
