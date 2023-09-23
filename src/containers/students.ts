import { Student } from '../models/Student';

import * as path from 'path';
import * as fs from 'fs';

export class StudentContainer {
  private students: Map<string, Student> = new Map();

  constructor() {
    this.bootstrap();
  }

  bootstrap(): void {
    const studentDatabasePath = path.join(
      __dirname,
      '../..',
      'data/students.json',
    );

    if (!fs.existsSync(studentDatabasePath)) {
      throw new Error('Student database not found! Please generate it first.');
    }

    const data = fs.readFileSync(studentDatabasePath, 'utf8');
    const students = JSON.parse(data);

    for (const [key, studentData] of Object.entries(students)) {
      this.addStudent(key, Student.fromJSON(studentData));
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
}

export const studentContainer = new StudentContainer();
