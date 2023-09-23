export class CombatClass {
  name: string;

  private constructor(name: string) {
    this.name = name;
  }

  static Striker = new CombatClass('Striker');
  static Special = new CombatClass('Special');

  static fromString = (name: string | null): CombatClass | null => {
    if (!name) {
      return null;
    }

    switch (name.toLowerCase()) {
      case 'striker':
        return CombatClass.Striker;
      case 'special':
        return CombatClass.Special;
      default:
        return null;
    }
  };
}
