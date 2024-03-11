export class WeaponType {
  code: string;
  name: string;

  private constructor(code: string, name: string) {
    this.code = code;
    this.name = name;
  }

  static AssaultRifle = new WeaponType('AR', 'Assault Rifle');
  static Flamethrower = new WeaponType('FT', 'Flamethrower');
  static GrenadeLauncher = new WeaponType('GL', 'Grenade Launcher');
  static Handgun = new WeaponType('HG', 'Handgun');
  static MachineGun = new WeaponType('MG', 'Machine Gun');
  static Mortar = new WeaponType('MT', 'Mortar');
  static Railgun = new WeaponType('RG', 'Railgun');
  static RocketLauncher = new WeaponType('RL', 'Rocket Launcher');
  static Shotgun = new WeaponType('SG', 'Shotgun');
  static SubmachineGun = new WeaponType('SMG', 'Submachine Gun');
  static SniperRifle = new WeaponType('SR', 'Sniper Rifle');

  static fromString = (name: string | null): WeaponType | null => {
    if (!name) {
      return null;
    }

    switch (name.toLowerCase().replace(/\s/g, '')) {
      case 'assaultrifle':
      case 'ar':
        return WeaponType.AssaultRifle;
      case 'flamethrower':
      case 'ft':
        return WeaponType.Flamethrower;
      case 'grenadelauncher':
      case 'gl':
        return WeaponType.GrenadeLauncher;
      case 'handgun':
      case 'hg':
        return WeaponType.Handgun;
      case 'machinegun':
      case 'mg':
        return WeaponType.MachineGun;
      case 'mortar':
      case 'mt':
        return WeaponType.Mortar;
      case 'railgun':
      case 'rg':
        return WeaponType.Railgun;
      case 'rocketlauncher':
      case 'rl':
        return WeaponType.RocketLauncher;
      case 'shotgun':
      case 'sg':
        return WeaponType.Shotgun;
      case 'submachinegun':
      case 'smg':
        return WeaponType.SubmachineGun;
      case 'sniperrifle':
      case 'sr':
        return WeaponType.SniperRifle;
      default:
        return null;
    }
  };

  static all() {
    return [
      WeaponType.AssaultRifle,
      WeaponType.Flamethrower,
      WeaponType.GrenadeLauncher,
      WeaponType.Handgun,
      WeaponType.MachineGun,
      WeaponType.Mortar,
      WeaponType.Railgun,
      WeaponType.RocketLauncher,
      WeaponType.Shotgun,
      WeaponType.SubmachineGun,
      WeaponType.SniperRifle,
    ] as const;
  }

  static codes() {
    return WeaponType.all().map((d) => d.code) as [string, ...string[]];
  }
}
