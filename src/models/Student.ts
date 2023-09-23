import { AttackType } from './AttackType';
import { CombatClass } from './CombatClass';
import { CombatPosition } from './CombatPosition';
import { CombatRole } from './CombatRole';
import { DefenseType } from './DefenseType';
import { Rarity } from './Rarity';
import { WeaponType } from './WeaponType';

export class Student {
  constructor(
    // basic info and trivia
    public name: string,
    public fullName: string,
    public school: string,
    public age: string,
    public birthday: string,
    public height: number,
    public hobbies: string | null,

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
      json['school'],
      json['age'],
      json['birthday'],
      json['height'],
      json['hobbies'],

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
}
