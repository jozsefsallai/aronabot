import { InferSelectModel, eq } from 'drizzle-orm';
import db from '../db';
import { missions } from '../db/schema';
import { exists } from '../db/utils';
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

  static async all() {
    return db
      .select()
      .from(missions)
      .execute()
      .then((entries) => entries.map(Mission.fromDBEntry));
  }

  static fromDBEntry(entry: InferSelectModel<typeof missions>): Mission {
    return new Mission(
      entry.name,
      entry.cost,
      Difficulty.fromString(entry.difficulty),
      Terrain.fromString(entry.terrain),
      entry.recommendedLevel,
      entry.drops,
      entry.stageImageUrl ?? undefined,
    );
  }

  toDBEntry(): Omit<InferSelectModel<typeof missions>, 'id'> {
    return {
      name: this.name,
      cost: this.cost,
      difficulty: this.difficulty?.id ?? null,
      terrain: this.terrain?.id ?? null,
      recommendedLevel: this.recommendedLevel,
      drops: this.drops,
      stageImageUrl: this.stageImageUrl ?? null,
    };
  }

  async save() {
    const entry = this.toDBEntry();

    if (await exists(db, missions, eq(missions.name, this.name))) {
      await this.update(entry);
    } else {
      await this.insert(entry);
    }
  }

  async insert(entry: Omit<InferSelectModel<typeof missions>, 'id'>) {
    await db.insert(missions).values(entry).execute();
  }

  async update(entry: Omit<InferSelectModel<typeof missions>, 'id'>) {
    await db
      .update(missions)
      .set(entry)
      .where(eq(missions.name, this.name))
      .execute();
  }
}
