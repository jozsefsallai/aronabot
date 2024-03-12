import { Student } from '../models/Student';

export class StudentContainer {
  private students: Map<string, Student> = new Map();

  constructor() {
    this.bootstrap();
  }

  async bootstrap(): Promise<void> {
    await this.reload();
  }

  async reload(): Promise<void> {
    this.students.clear();

    const students = await Student.all();
    for (const student of students) {
      this.addStudent(student.key, student);
    }
  }

  addStudent(key: string, student: Student): void {
    this.students.set(key, student);
  }

  getStudent(key: string): Student | null {
    if (this.students.has(key)) {
      return this.students.get(key)!;
    }

    return null;
  }

  getStudents(): Student[] {
    return Array.from(this.students.values());
  }

  getStudentsWhere(predicate: (student: Student) => boolean): Student[] {
    return this.getStudents().filter(predicate);
  }

  getStudentKeys(): string[] {
    return Array.from(this.students.keys());
  }

  getStudentKeysWhere(predicate: (student: Student) => boolean): string[] {
    return Array.from(this.students.entries())
      .filter(([_, student]) => predicate(student))
      .map(([key, _]) => key);
  }

  all(): Record<string, Student> {
    return Object.fromEntries(this.students.entries());
  }

  findManyByName(name: string): Student[] {
    function normalize(str: string): string {
      return str.toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    name = normalize(name);

    return this.getStudentsWhere((student) => {
      return normalize(student.name).includes(name);
    });
  }

  getByName(name: string): Student | null {
    const students = this.findManyByName(name);

    if (students.length > 0) {
      return students[0];
    }

    return null;
  }
}

export const studentContainer = new StudentContainer();
