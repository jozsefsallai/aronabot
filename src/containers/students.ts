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

    this.loadStudentsFromDatabase(studentDatabasePath);

    const extraStudentDatabasePath = path.join(
      __dirname,
      '../..',
      'data/students_extra.json',
    );

    if (fs.existsSync(extraStudentDatabasePath)) {
      this.loadStudentsFromDatabase(extraStudentDatabasePath);
    }
  }

  private loadStudentsFromDatabase(dbPath: string) {
    const data = fs.readFileSync(dbPath, 'utf8');
    const students = JSON.parse(data);

    for (const [key, studentData] of Object.entries(students)) {
      this.addStudent(key, Student.fromJSON(key, studentData));
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
