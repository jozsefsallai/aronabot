export class SkillType {
  name: string;
  code: string;

  private constructor(name: string, code: string) {
    this.name = name;
    this.code = code;
  }

  static EX = new SkillType('EX Skill', 'ex');
  static Basic = new SkillType('Basic Skill', 'basic');
  static Enhanced = new SkillType('Enhanced Skill', 'enhanced');
  static Sub = new SkillType('Subskill', 'sub');

  static fromString = (name: string | null): SkillType | null => {
    if (!name) {
      return null;
    }

    switch (name.toLowerCase()) {
      case 'ex':
        return SkillType.EX;
      case 'basic':
        return SkillType.Basic;
      case 'enhanced':
        return SkillType.Enhanced;
      case 'sub':
        return SkillType.Sub;
      default:
        return null;
    }
  };

  static all() {
    return [
      SkillType.EX,
      SkillType.Basic,
      SkillType.Enhanced,
      SkillType.Sub,
    ] as const;
  }

  static codes() {
    return SkillType.all().map((d) => d.code) as [string, ...string[]];
  }
}
