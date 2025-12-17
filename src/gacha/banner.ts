import { studentContainer } from "../containers/students";
import { GachaPool } from "./pool";

import {
  DEFAULT_BASE_ONE_STAR_RATE,
  DEFAULT_BASE_THREE_STAR_RATE,
  DEFAULT_BASE_TWO_STAR_RATE,
  DEFAULT_EXTRA_RATE,
  DEFAULT_PICKUP_RATE,
  DEFAULT_THREE_STAR_RATE,
} from "./constants";
import { db } from "../db";
import type { Banner, Student, BannerKind } from "../db/client";

export type DetailedGachaBanner = Banner & {
  pickupPoolStudents: Student[];
  extraPoolStudents: Student[];
  additionalThreeStarStudents: Student[];
};

export interface GachaBannerParams {
  id: string;
  name: string;

  date: string;

  threeStarRate?: number;
  pickupRate?: number;
  extraRate?: number;

  pickupPoolStudents?: Student[];
  extraPoolStudents?: Student[];
  additionalThreeStarStudents?: Student[];

  baseOneStarRate?: number;
  baseTwoStarRate?: number;
  baseThreeStarRate?: number;

  kind: BannerKind;
}

class GachaBanner {
  readonly id: string;
  readonly name: string;

  readonly date: Date;
  readonly kind: BannerKind;

  private _threeStarRate: number;
  private _pickupRate: number;
  private _extraRate: number;

  private _pickupPool: GachaPool;
  private _extraPool: GachaPool;
  private _oneStarPool: GachaPool;
  private _twoStarPool: GachaPool;
  private _threeStarPool: GachaPool;

  private _baseOneStarRate: number;
  private _baseTwoStarRate: number;
  private _baseThreeStarRate: number;

  private _isBootstrapped = false;

  constructor(params: GachaBannerParams) {
    this.id = params.id;
    this.name = params.name;

    this.date = new Date(params.date);

    this._threeStarRate = params.threeStarRate ?? DEFAULT_THREE_STAR_RATE;
    this._pickupRate = params.pickupRate ?? DEFAULT_PICKUP_RATE;
    this._extraRate = params.extraRate ?? DEFAULT_EXTRA_RATE;

    this._baseOneStarRate =
      params.baseOneStarRate ?? DEFAULT_BASE_ONE_STAR_RATE;
    this._baseTwoStarRate =
      params.baseTwoStarRate ?? DEFAULT_BASE_TWO_STAR_RATE;
    this._baseThreeStarRate =
      params.baseThreeStarRate ?? DEFAULT_BASE_THREE_STAR_RATE;

    this._pickupPool = new GachaPool(this.pickupRate);
    this._extraPool = new GachaPool(this.extraRate);
    this._oneStarPool = new GachaPool(this.oneStarRate);
    this._twoStarPool = new GachaPool(this.twoStarRate);
    this._threeStarPool = new GachaPool(this.threeStarRate);

    this.kind = params.kind;

    this.populatePools(
      params.pickupPoolStudents,
      params.extraPoolStudents,
      params.additionalThreeStarStudents,
    );
  }

  private isStudentAvailableInRegion(student: Student) {
    switch (this.kind) {
      case "Global":
        return student.isReleasedGlobal;
      case "JP":
        return student.isReleasedJP;
      default:
        return false;
    }
  }

  private isStudentLimited(student: Student) {
    switch (this.kind) {
      case "Global":
        return student.isLimitedGlobal;
      case "JP":
        return student.isLimitedJP;
      default:
        return false;
    }
  }

  private isStudentWelfare(student: Student) {
    switch (this.kind) {
      case "Global":
        return student.isWelfareGlobal;
      case "JP":
        return student.isWelfareJP;
      default:
        return false;
    }
  }

  private isStudentArchive(student: Student) {
    switch (this.kind) {
      case "Global":
        return student.isArchiveGlobal;
      case "JP":
        return student.isArchiveJP;
      default:
        return false;
    }
  }

  private isPullable(
    student: Student,
    additionalCondition: (student: Student) => boolean,
  ): boolean {
    return (
      !this.isStudentLimited(student) &&
      !this.isStudentWelfare(student) &&
      !this.isStudentArchive(student) &&
      this.isStudentAvailableInRegion(student) &&
      additionalCondition(student)
    );
  }

  private isOneStar(student: Student): boolean {
    return student.rarity === 1;
  }

  private isTwoStar(student: Student): boolean {
    return student.rarity === 2;
  }

  private isThreeStar(student: Student): boolean {
    return student.rarity === 3;
  }

  private populatePools(
    pickupPoolStudents?: Student[],
    extraPoolStudents?: Student[],
    additionalThreeStarStudents?: Student[],
  ): void {
    if (this._isBootstrapped) {
      return;
    }

    const oneStarStudents = studentContainer.getStudentsWhere((student) =>
      this.isPullable(student, this.isOneStar),
    );

    const twoStarStudents = studentContainer.getStudentsWhere((student) =>
      this.isPullable(student, this.isTwoStar),
    );

    const threeStarStudents = studentContainer
      .getStudentsWhere((student) => this.isPullable(student, this.isThreeStar))
      .filter(
        (student) =>
          !pickupPoolStudents?.includes(student) &&
          !extraPoolStudents?.includes(student),
      );

    oneStarStudents.forEach((student) => this._oneStarPool.addStudent(student));
    twoStarStudents.forEach((student) => this._twoStarPool.addStudent(student));
    threeStarStudents.forEach((student) =>
      this._threeStarPool.addStudent(student),
    );

    if (pickupPoolStudents) {
      pickupPoolStudents.forEach((student) =>
        this._pickupPool.addStudent(student),
      );
    }

    if (extraPoolStudents) {
      extraPoolStudents.forEach((student) =>
        this._extraPool.addStudent(student),
      );
    }

    if (additionalThreeStarStudents) {
      additionalThreeStarStudents.forEach((student) =>
        this._threeStarPool.addStudent(student),
      );
    }

    this._isBootstrapped = true;
  }

  private calculateRate(base: number): number {
    return (
      base - ((this._threeStarRate - this._baseThreeStarRate) / base) * 100
    );
  }

  get oneStarRate(): number {
    return this.calculateRate(this._baseOneStarRate);
  }

  get twoStarRate(): number {
    return this.calculateRate(this._baseTwoStarRate);
  }

  get threeStarRate(): number {
    return this._threeStarRate - this._pickupRate - this._extraRate;
  }

  get pickupRate(): number {
    return this._pickupRate;
  }

  get extraRate(): number {
    return this._extraRate;
  }

  get pools(): GachaPool[] {
    return [
      this._oneStarPool,
      this._twoStarPool,
      this._threeStarPool,
      this._pickupPool,
      this._extraPool,
    ];
  }

  pullTen(): [Student, string][] {
    let hasAtLeastTwoStar = false;

    const students: [Student, string][] = [];

    for (let i = 0; i < 10; ++i) {
      if (i === 9 && !hasAtLeastTwoStar) {
        const { student } = this.pull(true);

        if (student) {
          students.push(student);
        }
      } else {
        const { student, isOneStar } = this.pull();

        if (!isOneStar) {
          hasAtLeastTwoStar = true;
        }

        if (student) {
          students.push(student);
        }
      }
    }

    if (students.length < 10) {
      throw new Error("Failed to pull 10 students...");
    }

    // ensure last drop is always 2★ or higher
    if (students[students.length - 1][0].rarity === 1) {
      const firstNonOneStar = students.findIndex((student) => {
        return student[0].rarity !== 1;
      });

      if (firstNonOneStar !== -1) {
        const randomTwoStar = students[firstNonOneStar];
        const randomOneStar = students[students.length - 1];

        students[firstNonOneStar] = randomOneStar;
        students[students.length - 1] = randomTwoStar;
      }
    }

    return students;
  }

  pull(ensureNoOneStar = false) {
    const pools = this.pools.slice(0);
    let rates = pools.map((pool) => pool.rate);

    if (ensureNoOneStar) {
      const oneStarIndex = pools.findIndex(
        (pool) => pool === this._oneStarPool,
      );

      if (oneStarIndex !== -1) {
        pools.splice(oneStarIndex, 1);
        rates.splice(oneStarIndex, 1);
      }
    }

    // Normalize rates
    const sumRates = rates.reduce((a, b) => a + b, 0);
    rates = rates.map((rate) => rate / sumRates);

    // Randomly choose a pool based on probabilities
    const poolIndex = this.getRandomIndex(rates);
    const pool = pools[poolIndex];

    const isOneStar = pool === this._oneStarPool;
    const student = pool.pull();

    return {
      student,
      isOneStar,
    };
  }

  isPickup(key: string): boolean {
    return this._pickupPool.hasStudent(key);
  }

  private getRandomIndex(rates: number[]): number {
    const randomValue = Math.random();

    let cumulativeRate = 0;

    for (let i = 0; i < rates.length; ++i) {
      cumulativeRate += rates[i];

      if (randomValue <= cumulativeRate) {
        return i;
      }
    }

    // This should never happen, but who knows.
    return rates.length - 1;
  }

  static fromJSON(params: GachaBannerParams): GachaBanner {
    return new GachaBanner(params);
  }

  static async all() {
    return db.banner
      .findMany({
        orderBy: {
          sortKey: "asc",
        },
        include: {
          pickupPoolStudents: true,
          extraPoolStudents: true,
          additionalThreeStarStudents: true,
        },
      })
      .then((entries) => {
        return entries.map((entry) => GachaBanner.fromDBEntry(entry));
      });
  }

  static fromDBEntry(entry: DetailedGachaBanner): GachaBanner {
    return new GachaBanner({
      id: entry.id,
      name: entry.name,
      date: entry.date,
      threeStarRate: entry.threeStarRate / 1000,
      pickupRate: entry.pickupRate / 1000,
      extraRate: entry.extraRate / 1000,
      pickupPoolStudents: entry.pickupPoolStudents ?? undefined,
      extraPoolStudents: entry.extraPoolStudents ?? undefined,
      additionalThreeStarStudents:
        entry.additionalThreeStarStudents ?? undefined,
      baseOneStarRate: entry.baseOneStarRate / 1000,
      baseTwoStarRate: entry.baseTwoStarRate / 1000,
      baseThreeStarRate: entry.baseThreeStarRate / 1000,
      kind: entry.kind,
    });
  }
}

export { GachaBanner };
