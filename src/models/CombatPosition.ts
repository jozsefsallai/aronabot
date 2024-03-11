export class CombatPosition {
  id: string;
  name: string;

  private constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  static Front = new CombatPosition('front', 'Front');
  static Middle = new CombatPosition('middle', 'Middle');
  static Back = new CombatPosition('back', 'Back');

  static fromString = (name: string | null): CombatPosition | null => {
    if (!name) {
      return null;
    }

    switch (name.toLowerCase()) {
      case 'front':
        return CombatPosition.Front;
      case 'middle':
        return CombatPosition.Middle;
      case 'back':
        return CombatPosition.Back;
      default:
        return null;
    }
  };

  static all() {
    return [
      CombatPosition.Front,
      CombatPosition.Middle,
      CombatPosition.Back,
    ] as const;
  }

  static ids() {
    return CombatPosition.all().map((d) => d.id) as [string, ...string[]];
  }
}
