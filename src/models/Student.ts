import { Birthday, parseBirthday } from '../utils/date';
import { AttackType } from './AttackType';
import { CombatClass } from './CombatClass';
import { CombatPosition } from './CombatPosition';
import { CombatRole } from './CombatRole';
import { DefenseType } from './DefenseType';
import { Rarity } from './Rarity';
import { School } from './School';
import { WeaponType } from './WeaponType';

export class Student {
  public birthdayData: Birthday | null = null;

  constructor(
    // basic info and trivia
    public name: string,
    public fullName: string,
    public school: School,
    public age: string,
    public birthday: string,
    public height: string,
    public hobbies: string | null,
    public wikiImage: string | null,

    // combat info
    public attackType: AttackType | null,
    public defenseType: DefenseType | null,
    public combatClass: CombatClass | null,
    public combatRole: CombatRole | null,
    public combatPosition: CombatPosition | null,
    public usesCover: boolean,
    public weaponType: WeaponType | null,

    // gacha
    public rarity: Rarity,
    public isWelfare: boolean,
    public isLimited: boolean,

    public releaseDate: Date | null = null,
  ) {
    this.birthdayData = parseBirthday(this.birthday);
  }

  static fromJSON = (json: any): Student => {
    return new Student(
      json['name'],
      json['fullName'],
      School.fromString(json['school']),
      json['age'],
      json['birthday'],
      json['height'],
      json['hobbies'],
      json['wikiImage'],

      AttackType.fromString(json['attackType']),
      DefenseType.fromString(json['defenseType']),
      CombatClass.fromString(json['combatClass']),
      CombatRole.fromString(json['combatRole']),
      CombatPosition.fromString(json['combatPosition']),
      json['usesCover'],
      WeaponType.fromString(json['weaponType']),

      json['rarity'] as Rarity,
      json['isWelfare'] ?? false,
      json['isLimited'] ?? false,

      json['releaseDate'] ? new Date(json['releaseDate']) : null,
    );
  };

  get schaledbUrl(): string {
    let name = this.name.replace(/\s/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

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
}
