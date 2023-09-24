export class Terrain {
  name: string;

  private constructor(name: string) {
    this.name = name;
  }

  static Indoors = new Terrain('Indoors');
  static Outdoors = new Terrain('Outdoors');
  static Urban = new Terrain('Urban');

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
}
