export class School {
  public id: string;
  public name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  static Abydos = new School('abydos', 'Abydos High School');
  static Arius = new School('arius', 'Arius Satellite School');
  static Gehenna = new School('gehenna', 'Gehenna Academy');
  static Hyakkiyako = new School('hyakkiyako', 'Allied Hyakkiyako Academy');
  static Millennium = new School('millennium', 'Millennium Science School');
  static RedWinter = new School('redwinter', 'Red Winter Federal Academy');
  static Shanhaijing = new School('shanhaijing', 'Shanhaijing Academy');
  static SRT = new School('srt', 'SRT Special Academy');
  static Trinity = new School('trinity', 'Trinity General School');
  static Valkyrie = new School('valkyrie', 'Valkyrie Police School');
  static Tokiwadai = new School('tokiwadai', 'Tokiwadai Middle School');
  static Sakugawa = new School('sakugawa', 'Sakugawa Middle School');
  static NoSchool = new School('etc', 'N/A');

  static fromString = (name: string | null): School => {
    if (!name) {
      return School.NoSchool;
    }

    name = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '');

    switch (name) {
      case 'abydos':
        return School.Abydos;
      case 'arius':
        return School.Arius;
      case 'gehenna':
        return School.Gehenna;
      case 'hyakkiyako':
        return School.Hyakkiyako;
      case 'millennium':
        return School.Millennium;
      case 'redwinter':
        return School.RedWinter;
      case 'shanhaijing':
        return School.Shanhaijing;
      case 'srt':
        return School.SRT;
      case 'trinity':
        return School.Trinity;
      case 'valkyrie':
        return School.Valkyrie;
      case 'tokiwadai':
        return School.Tokiwadai;
      case 'sakugawa':
        return School.Sakugawa;
      default:
        return School.NoSchool;
    }
  };

  static all() {
    return [
      School.Abydos,
      School.Arius,
      School.Gehenna,
      School.Hyakkiyako,
      School.Millennium,
      School.RedWinter,
      School.Shanhaijing,
      School.SRT,
      School.Trinity,
      School.Valkyrie,
      School.Tokiwadai,
      School.Sakugawa,
      School.NoSchool,
    ] as const;
  }

  static ids() {
    return School.all().map((d) => d.id) as [string, ...string[]];
  }
}
