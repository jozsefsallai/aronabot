import { InferSelectModel, eq } from 'drizzle-orm';
import { studentContainer } from '../containers/students';
import { Student } from './Student';
import { gifts } from '../db/schema';
import db from '../db';
import { exists } from '../db/utils';

export class Gift {
  public studentsFavorite: Student[] = [];
  public studentsLiked: Student[] = [];

  constructor(
    public name: string,
    public iconUrl?: string,
    public description?: string,
    public rarity: number = 1,
    _studentsFavorite: string[] = [],
    _studentsLiked: string[] = [],
  ) {
    this.studentsFavorite = _studentsFavorite
      .map((key) => studentContainer.getStudent(key))
      .filter((student) => student !== undefined) as Student[];
    this.studentsLiked = _studentsLiked
      .map((key) => studentContainer.getStudent(key))
      .filter((student) => student !== undefined) as Student[];
  }

  static fromJSON = (json: any): Gift => {
    return new Gift(
      json['name'],
      json['iconUrl'],
      json['description'],
      json['rarity'],
      json['studentsFavorite'],
      json['studentsLiked'],
    );
  };

  static async all() {
    return db
      .select()
      .from(gifts)
      .orderBy(gifts.name)
      .execute()
      .then((entries) => entries.map(Gift.fromDBEntry));
  }

  static fromDBEntry(entry: InferSelectModel<typeof gifts>): Gift {
    return new Gift(
      entry.name,
      entry.iconUrl ?? undefined,
      entry.description ?? undefined,
      entry.rarity,
      entry.studentsFavorite ?? [],
      entry.studentsLiked ?? [],
    );
  }

  toDBEntry(): Omit<InferSelectModel<typeof gifts>, 'id'> {
    return {
      name: this.name,
      iconUrl: this.iconUrl ?? null,
      description: this.description ?? null,
      rarity: this.rarity,
      studentsFavorite: this.studentsFavorite.map((student) => student.key),
      studentsLiked: this.studentsLiked.map((student) => student.key),
    };
  }

  async save() {
    const entry = this.toDBEntry();

    if (await exists(db, gifts, eq(gifts.name, this.name))) {
      await this.update(entry);
    } else {
      await this.insert(entry);
    }
  }

  async insert(entry: Omit<InferSelectModel<typeof gifts>, 'id'>) {
    await db.insert(gifts).values(entry).execute();
  }

  async update(entry: Omit<InferSelectModel<typeof gifts>, 'id'>) {
    await db
      .update(gifts)
      .set(entry)
      .where(eq(gifts.name, this.name))
      .execute();
  }
}
