import {
  GAME_BLUE,
  GAME_PURPLE,
  GAME_RED,
  GAME_YELLOW,
} from '../utils/constants';
import { RGBValue } from '../utils/rgb';

export class AttackType {
  name: string;
  color: RGBValue;

  private constructor(name: string, color: RGBValue) {
    this.name = name;
    this.color = color;
  }

  static Explosive = new AttackType('Explosive', GAME_RED);
  static Piercing = new AttackType('Piercing', GAME_YELLOW);
  static Mystic = new AttackType('Mystic', GAME_BLUE);
  static Sonic = new AttackType('Sonic', GAME_PURPLE);

  static fromString = (name: string | null): AttackType | null => {
    if (!name) {
      return null;
    }

    switch (name.toLowerCase()) {
      case 'explosive':
        return AttackType.Explosive;
      case 'piercing':
      case 'penetration':
        return AttackType.Piercing;
      case 'mystic':
        return AttackType.Mystic;
      case 'sonic':
        return AttackType.Sonic;
      default:
        return null;
    }
  };
}
