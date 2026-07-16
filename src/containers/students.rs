use crate::db::models::DetailedStudent;
use crate::utils::similarity::similarity;
use std::collections::HashMap;

#[derive(Debug, Default)]
pub struct StudentContainer {
    students: HashMap<String, DetailedStudent>,
}

impl StudentContainer {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn reload(&mut self, students: Vec<DetailedStudent>) {
        self.students.clear();
        for student in students {
            self.students.insert(student.id().to_string(), student);
        }
    }

    pub fn get_student(&self, key: &str) -> Option<&DetailedStudent> {
        self.students.get(key)
    }

    pub fn get_students(&self) -> Vec<&DetailedStudent> {
        self.students.values().collect()
    }

    pub fn get_students_where<F>(&self, predicate: F) -> Vec<&DetailedStudent>
    where
        F: Fn(&DetailedStudent) -> bool,
    {
        self.students.values().filter(|s| predicate(s)).collect()
    }

    pub fn find_many_by_name(&self, name: &str) -> Vec<&DetailedStudent> {
        fn normalize(s: &str) -> String {
            s.to_lowercase()
                .chars()
                .filter(|c| c.is_ascii_alphanumeric())
                .collect()
        }

        let final_name = normalize(name);
        self.get_students_where(|student| normalize(student.name()).contains(&final_name))
    }

    pub fn sort_by_similarity(value: &str, students: &mut Vec<&DetailedStudent>) {
        let final_value = value.to_lowercase();
        students.sort_by(|a, b| {
            let a_sim = similarity(&a.name().to_lowercase(), &final_value);
            let b_sim = similarity(&b.name().to_lowercase(), &final_value);
            b_sim
                .partial_cmp(&a_sim)
                .unwrap_or(std::cmp::Ordering::Equal)
        });
    }

    pub fn get_by_name(&self, name: &str) -> Option<&DetailedStudent> {
        self.students
            .values()
            .find(|s| s.name().eq_ignore_ascii_case(name))
    }

    pub fn get_base_variants(&self) -> Vec<&DetailedStudent> {
        self.get_students_where(|s| s.base_variant_id.is_none())
    }

    pub fn get_variants_for_base<'a>(&'a self, base: &'a DetailedStudent) -> Vec<&'a DetailedStudent> {
        let mut variants = vec![base];
        for student in self.students.values() {
            if student.base_variant_id.as_deref() == Some(base.id()) {
                variants.push(student);
            }
        }
        variants
    }
}
