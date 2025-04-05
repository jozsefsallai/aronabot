import type { Gift, Skill, Student } from "@prisma/client";
import { similarity } from "../utils/similarity";
import { db } from "../db/client";

export type DetailedStudent = Student & {
  baseVariant?: Student | null;
  skills: Skill[];
  giftsAdored: Gift[];
  giftsLoved: Gift[];
  giftsLiked: Gift[];
};

export class StudentContainer {
  private students: Map<string, DetailedStudent> = new Map();

  async bootstrap(): Promise<void> {
    await this.reload();
  }

  async reload(): Promise<void> {
    this.students.clear();

    const students = await db.student.findMany({
      include: {
        baseVariant: true,
        skills: true,
        giftsAdored: true,
        giftsLoved: true,
        giftsLiked: true,
      },
    });

    for (const student of students) {
      this.addStudent(student.id, student);
    }
  }

  addStudent(key: string, student: DetailedStudent): void {
    this.students.set(key, student);
  }

  getStudent(key: string): DetailedStudent | null {
    if (this.students.has(key)) {
      return this.students.get(key) ?? null;
    }

    return null;
  }

  getStudents(): DetailedStudent[] {
    return Array.from(this.students.values());
  }

  getStudentsWhere(
    predicate: (student: DetailedStudent) => boolean,
  ): DetailedStudent[] {
    return this.getStudents().filter(predicate);
  }

  getStudentKeys(): string[] {
    return Array.from(this.students.keys());
  }

  getStudentKeysWhere(
    predicate: (student: DetailedStudent) => boolean,
  ): string[] {
    return Array.from(this.students.entries())
      .filter(([_, student]) => predicate(student))
      .map(([key, _]) => key);
  }

  all(): Record<string, DetailedStudent> {
    return Object.fromEntries(this.students.entries());
  }

  findManyByName(name: string): DetailedStudent[] {
    function normalize(str: string): string {
      return str.toLowerCase().replace(/[^a-z0-9]/g, "");
    }

    const finalName = normalize(name);

    return this.getStudentsWhere((student) => {
      return normalize(student.name).includes(finalName);
    });
  }

  static sortBySimilarity(value: string) {
    return (a: DetailedStudent, b: DetailedStudent) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();

      const finalValue = value.toLowerCase();

      const aSimilarity = similarity(aName, finalValue);
      const bSimilarity = similarity(bName, finalValue);

      return bSimilarity - aSimilarity;
    };
  }

  getByName(name: string): DetailedStudent | null {
    return (
      this.getStudents().find(
        (student) => student.name.toLowerCase() === name.toLowerCase(),
      ) ?? null
    );
  }

  getBaseVariants() {
    return this.getStudentsWhere((student) => student.baseVariantId === null);
  }

  getVariantsForBase(base: DetailedStudent) {
    const variants = [base];

    for (const student of this.getStudents()) {
      if (student.baseVariantId === base.id) {
        variants.push(student);
      }
    }

    return variants;
  }
}

export const studentContainer = new StudentContainer();
