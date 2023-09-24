import { AttackType } from './AttackType';
import { CombatClass } from './CombatClass';
import { CombatPosition } from './CombatPosition';
import { CombatRole } from './CombatRole';
import { DefenseType } from './DefenseType';
import { Rarity } from './Rarity';
import { School } from './School';
import { WeaponType } from './WeaponType';

export class Student {
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
  ) {}

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
}
