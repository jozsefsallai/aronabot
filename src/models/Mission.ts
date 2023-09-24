import { Difficulty } from './Difficulty';
import { Terrain } from './Terrain';

export class Mission {
  private constructor(
    public name: string,
    public cost: number,
    public difficulty: Difficulty | null,
    public terrain: Terrain | null,
    public recommendedLevel: number,
    public drops: string[],
    public stageImageUrl?: string,
  ) {}

  static fromJSON = (json: any): Mission => {
    return new Mission(
      json['name'],
      json['cost'],
      Difficulty.fromString(json['difficulty']),
      Terrain.fromString(json['terrain']),
      json['recommendedLevel'],
      json['drops'],
      json['stageImageUrl'],
    );
  };

  getMirahezeWikiUrl() {
    return `https://bluearchive.wiki/wiki/Missions/${this.name}`;
  }
}
