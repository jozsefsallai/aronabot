import type { BannerCounterKind, Student } from "../db/client";
import type { GachaBanner } from "./banner";
import recruitmentChargeManager from "./charge";
import recruitmentPointsManager from "./points";

export type GachaOptions = {
  banner: GachaBanner;
  userId: string;
  guildId: string;
  dryRun?: boolean;
  counterOverride?: number;
  counterKindOverride?: BannerCounterKind;
};

export type GachaResult = {
  students: Array<[Student, string]>;
  counter: number;
};

// Gacha system based on recruitment points. Each pull will grant 1 point. The
// number of points you have will not affect the actual pull result and getting
// a PU will not reset the counter automatically. The probability of getting a
// PU is fixed regardless of the number of pulls you've done.
export async function getPointsGachaResult(
  options: GachaOptions,
): Promise<GachaResult> {
  let counter = options.counterOverride ?? 0;

  if (options.dryRun) {
    counter += 10;
  } else {
    counter +=
      (await recruitmentPointsManager.incrementAndGet(
        options.banner.kind,
        options.guildId,
        options.userId,
      )) ?? 10;
  }

  const students = options.banner.pullTen();

  return {
    students,
    counter,
  };
}

// Gacha system based on recruitment charge. Each pull will grant 1 charge
// point. The 100th charge point will guarantee a 3* student, with a 50/50
// chance of getting the banner's PU student. The 200th charge point  will
// guarantee the PU student of the banner. Pulling a PU at any point will reset
// the counter to 0.
//   Note: Single pulls are not possible in Arona bot. Therefore, pulling 10
//   students and getting a PU on the 3rd slot means the charge counter resets
//   to 0 and then the remaining 7 slots will convert into 7 charge points.
export async function getChargeGachaResult(
  options: GachaOptions,
): Promise<GachaResult> {
  let counter = options.counterOverride ?? 0;

  if (!options.dryRun && !options.counterOverride) {
    counter =
      (await recruitmentChargeManager.get(
        options.banner.kind,
        options.banner.chargeCategory,
        options.guildId,
        options.userId,
      )) ?? 0;
  }

  const students = options.banner.pullTen(counter);

  for (const [_, key] of students) {
    counter++;

    if (options.banner.isPickup(key)) {
      counter = 0;
    }
  }

  await recruitmentChargeManager.set(
    options.banner.kind,
    options.banner.chargeCategory,
    options.guildId,
    options.userId,
    counter,
  );

  return {
    students,
    counter,
  };
}

export async function gacha(options: GachaOptions): Promise<GachaResult> {
  switch (options.counterKindOverride ?? options.banner.counterKind) {
    case "Points":
      return getPointsGachaResult(options);
    case "Charge":
      return getChargeGachaResult(options);
    default:
      throw new Error(`Invalid counter kind: ${options.banner.counterKind}`);
  }
}
