export class Difficulty {
  name: string;

  private constructor(name: string) {
    this.name = name;
  }

  static Normal = new Difficulty('Normal');
  static Hard = new Difficulty('Hard');
  static VeryHard = new Difficulty('Very Hard');
  static Hardcore = new Difficulty('Hardcore');
  static Extreme = new Difficulty('Extreme');
  static Insane = new Difficulty('Insane');
  static Torment = new Difficulty('Torment');

  static fromString = (name: string | null): Difficulty | null => {
    if (!name) {
      return null;
    }

    switch (name.toLowerCase()) {
      case 'normal':
        return Difficulty.Normal;
      case 'hard':
        return Difficulty.Hard;
      case 'very hard':
      case 'veryhard':
        return Difficulty.VeryHard;
      case 'hardcore':
        return Difficulty.Hardcore;
      case 'extreme':
        return Difficulty.Extreme;
      case 'insane':
        return Difficulty.Insane;
      case 'torment':
        return Difficulty.Torment;
      default:
        return null;
    }
  };
}
