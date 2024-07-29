import { InferSelectModel, eq } from 'drizzle-orm';
import { Birthday, parseBirthday } from '../utils/date';
import { AttackType } from './AttackType';
import { CombatClass } from './CombatClass';
import { CombatPosition } from './CombatPosition';
import { CombatRole } from './CombatRole';
import { DefenseType } from './DefenseType';
import { Rarity } from './Rarity';
import { School } from './School';
import { Skill } from './Skill';
import { WeaponType } from './WeaponType';
import { students } from '../db/schema';
import db from '../db';
import { exists } from '../db/utils';

export class Student {
  public birthdayData: Birthday | null = null;

  constructor(
    public key: string,

    // basic info and trivia
    public name: string,
    public fullName: string,
    public school: School,
    public age: string,
    public birthday: string,
    public height: string,
    public hobbies: string | null,
    public wikiImage: string | null,
    public recorobiLevel: number | null = null,

    // combat info
    public attackType: AttackType | null,
    public defenseType: DefenseType | null,
    public combatClass: CombatClass | null,
    public combatRole: CombatRole | null,
    public combatPosition: CombatPosition | null,
    public usesCover: boolean,
    public weaponType: WeaponType | null,
    public skills: Skill[] | undefined,

    // gacha
    public rarity: Rarity,
    public isWelfare: boolean,
    public isLimited: boolean,

    public releaseDate: Date | null = null,
  ) {
    this.birthdayData = parseBirthday(this.birthday);
  }

  static fromJSON = (key: string, json: any): Student => {
    return new Student(
      key,

      json['name'],
      json['fullName'],
      School.fromString(json['school']),
      json['age'],
      json['birthday'],
      json['height'],
      json['hobbies'],
      json['wikiImage'],
      json['recorobiLevel'],

      AttackType.fromString(json['attackType']),
      DefenseType.fromString(json['defenseType']),
      CombatClass.fromString(json['combatClass']),
      CombatRole.fromString(json['combatRole']),
      CombatPosition.fromString(json['combatPosition']),
      json['usesCover'],
      WeaponType.fromString(json['weaponType']),
      Skill.manyFromJSON(json['skills'] ?? []),

      json['rarity'] as Rarity,
      json['isWelfare'] ?? false,
      json['isLimited'] ?? false,

      json['releaseDate'] ? new Date(json['releaseDate']) : null,
    );
  };

  get schaledbUrl(): string {
    let name = this.name
      .replace(/\s/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '')
      .replace(/_{2,}/g, '_');

    if (name.includes('Bunny_Girl')) {
      name = name.replace('Bunny_Girl', 'Bunny');
    }

    if (name.includes('New_Year')) {
      name = name.replace('New_Year', 'NewYear');
    }

    return `https://schale.gg/?chara=${name}`;
  }

  get nextBirthday(): Date | null {
    if (!this.birthdayData) {
      return null;
    }

    const today = new Date();

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const nextBirthdayYear =
      currentMonth > this.birthdayData.month ? currentYear + 1 : currentYear;
    const nextBirthdayMonth = this.birthdayData.month;
    const nextBirthdayDay = this.birthdayData.day;

    return new Date(nextBirthdayYear, nextBirthdayMonth, nextBirthdayDay);
  }

  hasBirthdayOnMonth(month: number): boolean {
    if (!this.birthdayData) {
      return false;
    }

    return this.birthdayData.month === month;
  }

  get hasBirthdayThisMonth(): boolean {
    const today = new Date();
    return this.hasBirthdayOnMonth(today.getMonth());
  }

  get hasBirthdayToday(): boolean {
    if (!this.birthdayData) {
      return false;
    }

    const today = new Date();
    return (
      this.birthdayData.month === today.getMonth() &&
      this.birthdayData.day === today.getDate()
    );
  }

  get nextBirthdayString(): string {
    if (!this.nextBirthday) {
      return 'N/A';
    }

    const timestamp = this.nextBirthday.getTime();
    return `<t:${Math.floor(timestamp / 1000)}:R>`;
  }

  static async all() {
    return db
      .select()
      .from(students)
      .orderBy(students.id)
      .execute()
      .then((entries) => Promise.all(entries.map(Student.fromDBEntry)));
  }

  static async fromDBEntry(
    entry: InferSelectModel<typeof students>,
  ): Promise<Student> {
    const skills = await Skill.getSkillsForStudent(entry.id);

    return new Student(
      entry.id,
      entry.name,
      entry.fullName,
      School.fromString(entry.school),
      entry.age,
      entry.birthday,
      entry.height,
      entry.hobbies,
      entry.wikiImage,
      entry.recorobiLevel,
      AttackType.fromString(entry.attackType),
      DefenseType.fromString(entry.defenseType),
      CombatClass.fromString(entry.combatClass),
      CombatRole.fromString(entry.combatRole),
      CombatPosition.fromString(entry.combatPosition),
      entry.usesCover,
      WeaponType.fromString(entry.weaponType),
      skills,
      entry.rarity as Rarity,
      entry.isWelfare,
      entry.isLimited,
      entry.releaseDate ? new Date(entry.releaseDate) : null,
    );
  }

  toDBEntry(): InferSelectModel<typeof students> {
    return {
      id: this.key,
      name: this.name,
      fullName: this.fullName,
      school: this.school.id,
      age: this.age,
      birthday: this.birthday,
      height: this.height,
      hobbies: this.hobbies,
      wikiImage: this.wikiImage,
      recorobiLevel: this.recorobiLevel,
      attackType: this.attackType?.id ?? null,
      defenseType: this.defenseType?.id ?? null,
      combatClass: this.combatClass?.id ?? null,
      combatRole: this.combatRole?.id ?? null,
      combatPosition: this.combatPosition?.id ?? null,
      usesCover: this.usesCover,
      weaponType: this.weaponType?.code ?? null,
      rarity: this.rarity,
      isWelfare: this.isWelfare,
      isLimited: this.isLimited,
      releaseDate: this.releaseDate?.toISOString() ?? null,
    };
  }

  async save() {
    const entry = this.toDBEntry();
    if (await exists(db, students, eq(students.id, this.key))) {
      await this.update(entry);
    } else {
      await this.insert(entry);
    }
  }

  async insert(entry: InferSelectModel<typeof students>) {
    await db.insert(students).values(entry).execute();
  }

  async update(entry: InferSelectModel<typeof students>) {
    await db
      .update(students)
      .set(entry)
      .where(eq(students.id, this.key))
      .execute();
  }

  static async getFromDB(key: string): Promise<Student | null> {
    return db
      .select()
      .from(students)
      .where(eq(students.id, key))
      .execute()
      .then((entries) => {
        if (entries.length === 0) {
          return null;
        }

        return Student.fromDBEntry(entries[0]);
      });
  }
}
