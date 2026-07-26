import { similarity } from "../utils/similarity";
import type { BannerKind, Gift, Skill, Student } from "./client";
import { Prisma } from "./client";
import { db } from "./index";

export type DetailedStudent = Student & {
  baseVariant?: Student | null;
  skills: Skill[];
  giftsAdored: Gift[];
  giftsLoved: Gift[];
  giftsLiked: Gift[];
};

const detailedInclude = {
  baseVariant: true,
  skills: true,
  giftsAdored: true,
  giftsLoved: true,
  giftsLiked: true,
} as const;

function normalizeName(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function sortBySimilarity(value: string) {
  return (a: Student, b: Student) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const finalValue = value.toLowerCase();

    return similarity(bName, finalValue) - similarity(aName, finalValue);
  };
}

export async function findById(id: string): Promise<DetailedStudent | null> {
  return db.student.findUnique({
    where: { id },
    include: detailedInclude,
  });
}

export async function findByName(name: string): Promise<DetailedStudent | null> {
  return db.student.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
    include: detailedInclude,
  });
}

export async function findManyByName(name: string): Promise<Student[]> {
  const normalized = normalizeName(name);
  if (!normalized) {
    return [];
  }

  const rows = await db.$queryRaw<{ id: string }[]>(Prisma.sql`
    SELECT id FROM "Student"
    WHERE regexp_replace(lower(name), '[^a-z0-9]', '', 'g')
      LIKE ${`%${normalized}%`}
  `);

  if (rows.length === 0) {
    return [];
  }

  return db.student.findMany({
    where: {
      id: {
        in: rows.map((row) => row.id),
      },
    },
  });
}

export async function findAll(): Promise<Student[]> {
  return db.student.findMany();
}

export async function findBaseVariants(): Promise<Student[]> {
  return db.student.findMany({
    where: {
      baseVariantId: null,
    },
  });
}

export async function findVariantsForBase(base: Student): Promise<Student[]> {
  const variants = await db.student.findMany({
    where: {
      baseVariantId: base.id,
    },
  });

  return [base, ...variants];
}

export async function findPullableForBanner(
  kind: BannerKind,
): Promise<Student[]> {
  switch (kind) {
    case "Global":
      return db.student.findMany({
        where: {
          isReleasedGlobal: true,
          isLimitedGlobal: false,
          isWelfareGlobal: false,
          isArchiveGlobal: false,
        },
      });
    case "JP":
      return db.student.findMany({
        where: {
          isReleasedJP: true,
          isLimitedJP: false,
          isWelfareJP: false,
          isArchiveJP: false,
        },
      });
    default:
      return [];
  }
}
