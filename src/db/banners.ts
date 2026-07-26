import { GachaBanner } from "../gacha/banner";
import type { BannerKind, Student } from "./client";
import { db } from "./index";
import { findPullableForBanner } from "./students";

const bannerInclude = {
  pickupPoolStudents: true,
  extraPoolStudents: true,
  additionalThreeStarStudents: true,
} as const;

async function pullableByKind(
  kinds: BannerKind[],
): Promise<Map<BannerKind, Student[]>> {
  const uniqueKinds = [...new Set(kinds)];
  const entries = await Promise.all(
    uniqueKinds.map(
      async (kind) =>
        [kind, await findPullableForBanner(kind)] as [BannerKind, Student[]],
    ),
  );

  return new Map(entries);
}

export async function findAll(): Promise<GachaBanner[]> {
  const entries = await db.banner.findMany({
    orderBy: {
      sortKey: "asc",
    },
    include: bannerInclude,
  });

  const pullable = await pullableByKind(entries.map((entry) => entry.kind));

  return entries.map((entry) =>
    GachaBanner.fromDBEntry(entry, pullable.get(entry.kind) ?? []),
  );
}

export async function findById(id: string): Promise<GachaBanner | null> {
  const entry = await db.banner.findUnique({
    where: { id },
    include: bannerInclude,
  });

  if (!entry) {
    return null;
  }

  const pullableStudents = await findPullableForBanner(entry.kind);
  return GachaBanner.fromDBEntry(entry, pullableStudents);
}
