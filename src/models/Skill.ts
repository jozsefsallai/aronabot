import { InferSelectModel, eq } from 'drizzle-orm';
import { SkillType } from './SkillType';
import { skills } from '../db/schema';
import db from '../db';

export class Skill {
  constructor(
    public kind: SkillType,
    public name: string,
    public description: string,
    public cost?: string | null,
  ) {}

  static fromJSON = (json: any): Skill => {
    const kind = SkillType.fromString(json['kind']);

    if (!kind) {
      throw new Error(`Invalid skill kind: ${json['kind']}`);
    }

    return new Skill(kind, json['name'], json['description'], json['cost']);
  };

  static manyFromJSON = (json: any[]): Skill[] => {
    return json.map((skill) => Skill.fromJSON(skill));
  };

  get title(): string {
    if (this.cost) {
      return `${this.name} (Cost: ${this.cost})`;
    }

    return this.name;
  }

  static fromDBEntry(entry: InferSelectModel<typeof skills>): Skill {
    return new Skill(
      SkillType.fromString(entry.kind)!,
      entry.name,
      entry.description,
      entry.cost ?? null,
    );
  }

  toDBEntry(studentId: string): Omit<InferSelectModel<typeof skills>, 'id'> {
    return {
      kind: this.kind.code,
      name: this.name,
      description: this.description,
      cost: this.cost ?? null,
      studentId,
    };
  }

  static async deleteAllForStudent(studentId: string) {
    await db.delete(skills).where(eq(skills.studentId, studentId)).execute();
  }

  static async getSkillsForStudent(studentId: string) {
    return db
      .select()
      .from(skills)
      .where(eq(skills.studentId, studentId))
      .orderBy(skills.id)
      .execute()
      .then((entries) => entries.map(Skill.fromDBEntry));
  }

  async insert(
    studentId: string,
    entry: Omit<InferSelectModel<typeof skills>, 'id'>,
  ) {
    await db
      .insert(skills)
      .values({ ...entry, studentId })
      .execute();
  }

  async save(studentId: string) {
    const entry = this.toDBEntry(studentId);
    await this.insert(studentId, entry);
  }
}
