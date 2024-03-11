export class CombatRole {
  id: string;
  role: string;

  private constructor(id: string, role: string) {
    this.id = id;
    this.role = role;
  }

  static Attacker = new CombatRole('attacker', 'Attacker');
  static Healer = new CombatRole('healer', 'Healer');
  static Support = new CombatRole('support', 'Support');
  static TacticalSupport = new CombatRole('t.s.', 'T.S.');
  static Tank = new CombatRole('tank', 'Tank');

  static fromString = (role: string | null): CombatRole | null => {
    if (!role) {
      return null;
    }

    switch (role.toLowerCase()) {
      case 'attacker':
        return CombatRole.Attacker;
      case 'healer':
        return CombatRole.Healer;
      case 'support':
        return CombatRole.Support;
      case 'tactical support':
      case 'tacticalsupport':
      case 't.s.':
        return CombatRole.TacticalSupport;
      case 'tank':
        return CombatRole.Tank;
      default:
        return null;
    }
  };

  static all() {
    return [
      CombatRole.Attacker,
      CombatRole.Healer,
      CombatRole.Support,
      CombatRole.TacticalSupport,
      CombatRole.Tank,
    ] as const;
  }

  static ids() {
    return CombatRole.all().map((d) => d.id) as [string, ...string[]];
  }
}
