export class RGBValue {
  r: number;
  g: number;
  b: number;

  private static cache: Map<number, RGBValue> = new Map();

  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  static make(r: number, g: number, b: number): RGBValue {
    const key = (r << 16) + (g << 8) + b;

    if (RGBValue.cache.has(key)) {
      return RGBValue.cache.get(key)!;
    }

    const rgbvalue = new RGBValue(r, g, b);
    RGBValue.cache.set(key, rgbvalue);
    return rgbvalue;
  }

  toArray(): [number, number, number] {
    return [this.r, this.g, this.b];
  }

  toCSSString(): string {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }
}
