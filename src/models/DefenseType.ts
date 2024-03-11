import {
  GAME_BLUE,
  GAME_PURPLE,
  GAME_RED,
  GAME_YELLOW,
} from '../utils/constants';
import { RGBValue } from '../utils/rgb';

export class DefenseType {
  id: string;
  name: string;
  color: RGBValue;

  private constructor(id: string, name: string, color: RGBValue) {
    this.id = id;
    this.name = name;
    this.color = color;
  }

  static Light = new DefenseType('light', 'Light', GAME_RED);
  static Heavy = new DefenseType('heavy', 'Heavy', GAME_YELLOW);
  static Special = new DefenseType('special', 'Special', GAME_BLUE);
  static Elastic = new DefenseType('elastic', 'Elastic', GAME_PURPLE);

  static fromString = (name: string | null): DefenseType | null => {
    if (!name) {
      return null;
    }

    switch (name.toLowerCase()) {
      case 'light':
        return DefenseType.Light;
      case 'heavy':
        return DefenseType.Heavy;
      case 'special':
        return DefenseType.Special;
      case 'elastic':
        return DefenseType.Elastic;
      default:
        return null;
    }
  };

  static all() {
    return [
      DefenseType.Light,
      DefenseType.Heavy,
      DefenseType.Special,
      DefenseType.Elastic,
    ] as const;
  }

  static ids() {
    return DefenseType.all().map((d) => d.id) as [string, ...string[]];
  }
}
