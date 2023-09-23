export class CombatPosition {
  name: string;

  private constructor(name: string) {
    this.name = name;
  }

  static Front = new CombatPosition('Front');
  static Middle = new CombatPosition('Middle');
  static Back = new CombatPosition('Back');

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
}
