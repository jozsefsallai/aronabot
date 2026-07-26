import type { Gift, Student } from "./client";
import { db } from "./index";

export type DetailedGift = Gift & {
  adoredBy: Student[];
  lovedBy: Student[];
  likedBy: Student[];
};

const detailedInclude = {
  adoredBy: true,
  lovedBy: true,
  likedBy: true,
} as const;

export async function findByName(name: string): Promise<DetailedGift | null> {
  return db.gift.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
    include: detailedInclude,
  });
}

export async function findManyByName(name: string): Promise<Gift[]> {
  return db.gift.findMany({
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}
