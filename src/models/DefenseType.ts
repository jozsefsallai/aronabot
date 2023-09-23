import {
  GAME_BLUE,
  GAME_PURPLE,
  GAME_RED,
  GAME_YELLOW,
} from '../utils/constants';
import { RGBValue } from '../utils/rgb';

export class DefenseType {
  name: string;
  color: RGBValue;

  private constructor(name: string, color: RGBValue) {
    this.name = name;
    this.color = color;
  }

  static Light = new DefenseType('Light', GAME_RED);
  static Heavy = new DefenseType('Heavy', GAME_YELLOW);
  static Special = new DefenseType('Special', GAME_BLUE);
  static Elastic = new DefenseType('Elastic', GAME_PURPLE);

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
}
