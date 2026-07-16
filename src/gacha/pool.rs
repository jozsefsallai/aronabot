use crate::db::models::Student;
use rand::Rng;

#[derive(Debug, Clone)]
pub struct GachaPool {
    pub rate: f64,
    pub students: Vec<Student>,
}

impl GachaPool {
    pub fn new(rate: f64) -> Self {
        Self {
            rate,
            students: Vec::new(),
        }
    }

    pub fn add_student(&mut self, student: Student) {
        self.students.push(student);
    }

    pub fn has_student(&self, key: &str) -> bool {
        self.students.iter().any(|s| s.id == key)
    }

    pub fn pull<R: Rng + ?Sized>(&self, rng: &mut R) -> Option<(Student, String)> {
        if self.students.is_empty() {
            return None;
        }
        let index = rng.gen_range(0..self.students.len());
        let student = self.students[index].clone();
        let id = student.id.clone();
        Some((student, id))
    }
}
