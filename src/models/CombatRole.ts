export class CombatRole {
  role: string;

  private constructor(role: string) {
    this.role = role;
  }

  static Attacker = new CombatRole('Attacker');
  static Healer = new CombatRole('Healer');
  static Support = new CombatRole('Support');
  static TacticalSupport = new CombatRole('T.S.');
  static Tank = new CombatRole('Tank');

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
}
