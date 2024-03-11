import {
  GAME_BLUE,
  GAME_PURPLE,
  GAME_RED,
  GAME_YELLOW,
} from '../utils/constants';
import { RGBValue } from '../utils/rgb';

export class AttackType {
  id: string;
  name: string;
  color: RGBValue;

  private constructor(id: string, name: string, color: RGBValue) {
    this.id = id;
    this.name = name;
    this.color = color;
  }

  static Explosive = new AttackType('explosive', 'Explosive', GAME_RED);
  static Piercing = new AttackType('piercing', 'Piercing', GAME_YELLOW);
  static Mystic = new AttackType('mystic', 'Mystic', GAME_BLUE);
  static Sonic = new AttackType('sonic', 'Sonic', GAME_PURPLE);

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

  static all() {
    return [
      AttackType.Explosive,
      AttackType.Piercing,
      AttackType.Mystic,
      AttackType.Sonic,
    ] as const;
  }

  static ids() {
    return AttackType.all().map((d) => d.id) as [string, ...string[]];
  }
}
