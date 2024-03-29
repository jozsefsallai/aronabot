export class Difficulty {
  id: string;
  name: string;

  private constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  static Normal = new Difficulty('normal', 'Normal');
  static Hard = new Difficulty('hard', 'Hard');
  static VeryHard = new Difficulty('veryhard', 'Very Hard');
  static Hardcore = new Difficulty('hardcode', 'Hardcore');
  static Extreme = new Difficulty('extreme', 'Extreme');
  static Insane = new Difficulty('insane', 'Insane');
  static Torment = new Difficulty('torment', 'Torment');

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

  static all() {
    return [
      Difficulty.Normal,
      Difficulty.Hard,
      Difficulty.VeryHard,
      Difficulty.Hardcore,
      Difficulty.Extreme,
      Difficulty.Insane,
      Difficulty.Torment,
    ] as const;
  }

  static ids() {
    return Difficulty.all().map((d) => d.id) as [string, ...string[]];
  }
}
