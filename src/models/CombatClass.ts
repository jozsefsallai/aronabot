export class CombatClass {
  id: string;
  name: string;

  private constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  static Striker = new CombatClass('striker', 'Striker');
  static Special = new CombatClass('special', 'Special');

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

  static all() {
    return [CombatClass.Striker, CombatClass.Special] as const;
  }

  static ids() {
    return CombatClass.all().map((d) => d.id) as [string, ...string[]];
  }
}
