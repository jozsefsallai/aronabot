use super::pool::GachaPool;
use crate::db::enums::BannerKind;
use crate::db::models::{DetailedBanner, Student};
use anyhow::{anyhow, Result};
use rand::Rng;

#[derive(Debug, Clone)]
pub struct GachaBanner {
    pub id: String,
    pub name: String,
    pub kind: BannerKind,
    three_star_rate: f64,
    pickup_rate: f64,
    extra_rate: f64,
    base_one_star_rate: f64,
    base_two_star_rate: f64,
    base_three_star_rate: f64,
    pickup_pool: GachaPool,
    extra_pool: GachaPool,
    one_star_pool: GachaPool,
    two_star_pool: GachaPool,
    three_star_pool: GachaPool,
    additional_three_star_students: Vec<Student>,
}

impl GachaBanner {
    pub fn from_db_entry(entry: DetailedBanner, all_students: &[Student]) -> Self {
        let three_star_rate = entry.banner.three_star_rate as f64 / 1000.0;
        let pickup_rate = entry.banner.pickup_rate as f64 / 1000.0;
        let extra_rate = entry.banner.extra_rate as f64 / 1000.0;
        let base_one_star_rate = entry.banner.base_one_star_rate as f64 / 1000.0;
        let base_two_star_rate = entry.banner.base_two_star_rate as f64 / 1000.0;
        let base_three_star_rate = entry.banner.base_three_star_rate as f64 / 1000.0;

        let mut banner = Self {
            id: entry.banner.id,
            name: entry.banner.name,
            kind: entry.banner.kind,
            three_star_rate,
            pickup_rate,
            extra_rate,
            base_one_star_rate,
            base_two_star_rate,
            base_three_star_rate,
            pickup_pool: GachaPool::new(pickup_rate),
            extra_pool: GachaPool::new(extra_rate),
            one_star_pool: GachaPool::new(0.0),
            two_star_pool: GachaPool::new(0.0),
            three_star_pool: GachaPool::new(0.0),
            additional_three_star_students: entry.additional_three_star_students.clone(),
        };

        banner.one_star_pool.rate = banner.one_star_rate();
        banner.two_star_pool.rate = banner.two_star_rate();
        banner.three_star_pool.rate = banner.three_star_pool_rate();

        banner.populate_pools(
            all_students,
            &entry.pickup_pool_students,
            &entry.extra_pool_students,
            &entry.additional_three_star_students,
        );

        banner
    }

    fn is_student_available(&self, student: &Student) -> bool {
        match self.kind {
            BannerKind::Global => student.is_released_global,
            BannerKind::JP => student.is_released_jp,
        }
    }

    fn is_student_limited(&self, student: &Student) -> bool {
        match self.kind {
            BannerKind::Global => student.is_limited_global,
            BannerKind::JP => student.is_limited_jp,
        }
    }

    fn is_student_welfare(&self, student: &Student) -> bool {
        match self.kind {
            BannerKind::Global => student.is_welfare_global,
            BannerKind::JP => student.is_welfare_jp,
        }
    }

    fn is_student_archive(&self, student: &Student) -> bool {
        match self.kind {
            BannerKind::Global => student.is_archive_global,
            BannerKind::JP => student.is_archive_jp,
        }
    }

    fn is_pullable(&self, student: &Student, rarity: i32) -> bool {
        !self.is_student_limited(student)
            && !self.is_student_welfare(student)
            && !self.is_student_archive(student)
            && self.is_student_available(student)
            && student.rarity == rarity
    }

    fn populate_pools(
        &mut self,
        all_students: &[Student],
        pickup: &[Student],
        extra: &[Student],
        additional: &[Student],
    ) {
        let pickup_ids: Vec<&str> = pickup.iter().map(|s| s.id.as_str()).collect();
        let extra_ids: Vec<&str> = extra.iter().map(|s| s.id.as_str()).collect();

        for student in all_students {
            if self.is_pullable(student, 1) {
                self.one_star_pool.add_student(student.clone());
            } else if self.is_pullable(student, 2) {
                self.two_star_pool.add_student(student.clone());
            } else if self.is_pullable(student, 3)
                && !pickup_ids.contains(&student.id.as_str())
                && !extra_ids.contains(&student.id.as_str())
            {
                self.three_star_pool.add_student(student.clone());
            }
        }

        for student in pickup {
            self.pickup_pool.add_student(student.clone());
        }
        for student in extra {
            self.extra_pool.add_student(student.clone());
        }
        for student in additional {
            self.three_star_pool.add_student(student.clone());
        }
    }

    fn calculate_rate(&self, base: f64) -> f64 {
        base - ((self.three_star_rate - self.base_three_star_rate) / base) * 100.0
    }

    pub fn one_star_rate(&self) -> f64 {
        self.calculate_rate(self.base_one_star_rate)
    }

    pub fn two_star_rate(&self) -> f64 {
        self.calculate_rate(self.base_two_star_rate)
    }

    pub fn three_star_pool_rate(&self) -> f64 {
        self.three_star_rate - self.pickup_rate - self.extra_rate
    }

    pub fn pickup_rate(&self) -> f64 {
        self.pickup_rate
    }

    pub fn extra_rate(&self) -> f64 {
        self.extra_rate
    }

    fn pools(&self) -> [&GachaPool; 5] {
        [
            &self.one_star_pool,
            &self.two_star_pool,
            &self.three_star_pool,
            &self.pickup_pool,
            &self.extra_pool,
        ]
    }

    pub fn pull_ten<R: Rng + ?Sized>(&self, rng: &mut R) -> Result<Vec<(Student, String)>> {
        let mut has_at_least_two_star = false;
        let mut students = Vec::with_capacity(10);

        for i in 0..10 {
            if i == 9 && !has_at_least_two_star {
                if let Some(student) = self.pull(rng, true) {
                    students.push(student);
                }
            } else {
                let result = self.pull(rng, false);
                if let Some((ref student, _)) = result {
                    if student.rarity != 1 {
                        has_at_least_two_star = true;
                    }
                }
                if let Some(student) = result {
                    students.push(student);
                }
            }
        }

        if students.len() < 10 {
            return Err(anyhow!("Failed to pull 10 students..."));
        }

        // Ensure last drop is always 2★ or higher
        if students.last().map(|(s, _)| s.rarity) == Some(1) {
            if let Some(first_non_one) = students.iter().position(|(s, _)| s.rarity != 1) {
                let last = students.len() - 1;
                students.swap(first_non_one, last);
            }
        }

        Ok(students)
    }

    pub fn pull<R: Rng + ?Sized>(
        &self,
        rng: &mut R,
        ensure_no_one_star: bool,
    ) -> Option<(Student, String)> {
        let mut pools: Vec<&GachaPool> = self.pools().to_vec();
        let mut rates: Vec<f64> = pools.iter().map(|p| p.rate).collect();

        if ensure_no_one_star {
            if let Some(idx) = pools.iter().position(|p| std::ptr::eq(*p, &self.one_star_pool)) {
                pools.remove(idx);
                rates.remove(idx);
            }
        }

        let sum: f64 = rates.iter().sum();
        if sum <= 0.0 {
            return None;
        }
        rates.iter_mut().for_each(|r| *r /= sum);

        let pool_index = get_random_index(rng, &rates);
        let pool = pools.get(pool_index)?;
        pool.pull(rng)
    }

    pub fn is_pickup(&self, key: &str) -> bool {
        self.pickup_pool.has_student(key)
    }

    pub fn is_extra(&self, key: &str) -> bool {
        self.extra_pool.has_student(key)
    }

    pub fn is_additional_three_star(&self, key: &str) -> bool {
        self.additional_three_star_students
            .iter()
            .any(|s| s.id == key)
    }
}

fn get_random_index<R: Rng + ?Sized>(rng: &mut R, rates: &[f64]) -> usize {
    let random_value: f64 = rng.gen();
    let mut cumulative = 0.0;
    for (i, rate) in rates.iter().enumerate() {
        cumulative += rate;
        if random_value <= cumulative {
            return i;
        }
    }
    rates.len().saturating_sub(1)
}

#[cfg(test)]
mod tests {
    use super::*;
    use rand::SeedableRng;
    use rand_chacha::ChaCha8Rng;

    fn dummy_student(id: &str, rarity: i32) -> Student {
        use crate::db::enums::*;
        Student {
            id: id.to_string(),
            dev_name: id.to_string(),
            schale_db_id: 1,
            default_order: 0,
            name: id.to_string(),
            last_name: id.to_string(),
            first_name: id.to_string(),
            name_jp: String::new(),
            last_name_jp: String::new(),
            first_name_jp: String::new(),
            school: School::Abydos,
            club: Club::EmptyClub,
            age: "16".into(),
            birthday: "January 1".into(),
            introduction: None,
            hobbies: None,
            voice_actor: None,
            illustrator: None,
            designer: None,
            height: None,
            memorobi_level: 0,
            combat_class: CombatClass::Main,
            combat_role: CombatRole::DamageDealer,
            combat_position: CombatPosition::Front,
            attack_type: AttackType::Explosion,
            defense_type: DefenseType::LightArmor,
            street_battle_adaptation: 0,
            outdoor_battle_adaptation: 0,
            indoor_battle_adaptation: 0,
            weapon_type: WeaponType::AR,
            uses_cover: true,
            equipment: vec![],
            has_bond_gear_jp: false,
            has_bond_gear_global: false,
            has_bond_gear_cn: false,
            rarity,
            is_released_jp: true,
            is_released_global: true,
            is_released_cn: false,
            is_welfare_jp: false,
            is_welfare_global: false,
            is_welfare_cn: false,
            is_limited_jp: false,
            is_limited_global: false,
            is_limited_cn: false,
            is_fest_jp: false,
            is_fest_global: false,
            is_fest_cn: false,
            is_archive_jp: false,
            is_archive_global: false,
            is_archive_cn: false,
            search_tags: vec![],
            base_variant_id: None,
        }
    }

    #[test]
    fn pull_ten_always_returns_ten_and_last_not_one_star_when_possible() {
        let mut ones = Vec::new();
        let mut twos = Vec::new();
        let mut threes = Vec::new();
        for i in 0..20 {
            ones.push(dummy_student(&format!("1_{i}"), 1));
            twos.push(dummy_student(&format!("2_{i}"), 2));
            threes.push(dummy_student(&format!("3_{i}"), 3));
        }
        let all: Vec<_> = ones
            .iter()
            .chain(twos.iter())
            .chain(threes.iter())
            .cloned()
            .collect();

        let entry = DetailedBanner {
            banner: crate::db::models::BannerRow {
                id: "regular".into(),
                name: "Regular".into(),
                sort_key: 1,
                date: "2024-01-01".into(),
                three_star_rate: 30,
                pickup_rate: 0,
                extra_rate: 0,
                base_one_star_rate: 785,
                base_two_star_rate: 185,
                base_three_star_rate: 30,
                kind: BannerKind::Global,
            },
            pickup_pool_students: vec![],
            extra_pool_students: vec![],
            additional_three_star_students: vec![],
        };

        let banner = GachaBanner::from_db_entry(entry, &all);
        let mut rng = ChaCha8Rng::seed_from_u64(42);

        for _ in 0..50 {
            let pulls = banner.pull_ten(&mut rng).unwrap();
            assert_eq!(pulls.len(), 10);
            assert!(pulls.last().unwrap().0.rarity >= 2);
        }
    }
}
