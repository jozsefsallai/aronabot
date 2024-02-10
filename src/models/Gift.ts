import { studentContainer } from '../containers/students';
import { Student } from './Student';

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
}
