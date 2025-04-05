import type { Student } from "@prisma/client";

export class GachaPool {
  readonly rate: number;

  readonly students: Student[];

  constructor(rate: number) {
    this.rate = rate;
    this.students = [];
  }

  addStudent(student: Student): void {
    this.students.push(student);
  }

  hasStudent(key: string): boolean {
    return this.students.some((student) => student.id === key);
  }

  pull(): [Student, string] | null {
    const index = Math.floor(Math.random() * this.students.length);
    const student = this.students[index];

    if (!student) {
      return null;
    }

    return [student, student.id];
  }
}
