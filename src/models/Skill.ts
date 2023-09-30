import { SkillType } from './SkillType';

export class Skill {
  constructor(
    public kind: SkillType,
    public name: string,
    public description: string,
    public cost?: string | null,
  ) {}

  static fromJSON = (json: any): Skill => {
    const kind = SkillType.fromString(json['kind']);

    if (!kind) {
      throw new Error(`Invalid skill kind: ${json['kind']}`);
    }

    return new Skill(kind, json['name'], json['description'], json['cost']);
  };

  static manyFromJSON = (json: any[]): Skill[] => {
    return json.map((skill) => Skill.fromJSON(skill));
  };

  get title(): string {
    if (this.cost) {
      return `${this.name} (Cost: ${this.cost})`;
    }

    return this.name;
  }
}
