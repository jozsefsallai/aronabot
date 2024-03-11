export class Terrain {
  id: string;
  name: string;

  private constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  static Indoors = new Terrain('indoors', 'Indoors');
  static Outdoors = new Terrain('outdoors', 'Outdoors');
  static Urban = new Terrain('urban', 'Urban');

  static fromString = (name: string | null): Terrain | null => {
    if (!name) {
      return null;
    }

    switch (name.toLowerCase()) {
      case 'indoors':
        return Terrain.Indoors;
      case 'outdoors':
        return Terrain.Outdoors;
      case 'urban':
        return Terrain.Urban;
      default:
        return null;
    }
  };

  static all() {
    return [Terrain.Indoors, Terrain.Outdoors, Terrain.Urban] as const;
  }

  static ids() {
    return Terrain.all().map((d) => d.id) as [string, ...string[]];
  }
}
