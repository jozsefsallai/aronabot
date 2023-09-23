import { studentContainer } from '../containers/students';
import { Student } from '../models/Student';

export class GachaPool {
  readonly rate: number;

  readonly students: string[];

  constructor(rate: number) {
    this.rate = rate;
    this.students = [];
  }

  addStudent(key: string): void {
    this.students.push(key);
  }

  hasStudent(key: string): boolean {
    return this.students.includes(key);
  }

  pull(): [Student, string] | null {
    const index = Math.floor(Math.random() * this.students.length);
    const key = this.students[index];

    const student = studentContainer.getStudent(key);

    if (!student) {
      return null;
    }

    return [student, key];
  }
}
