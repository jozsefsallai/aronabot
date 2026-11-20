import type {
  SkillEffectCategory,
  SkillLocale,
  SkillType,
  StudentSkillSource,
} from "./client";
import { db } from "./index";

const TEXT_LOCALES: SkillLocale[] = ["en", "jp"];

export type StudentSkillView = {
  id: string;
  type: SkillType;
  source: StudentSkillSource;
  sortOrder: number;
  formIndices: number[];
  requiredWeaponGrade: number;
  requiredGearTier: number;
  upgradeOfId: string | null;
  parentId: string | null;
  iconName: string;
  maxLevel: number;
  costs: number[];
  name: string;
  templates: string[];
  levelTemplates: number[];
  params: string[][];
  useCondition: string | null;
  isFallback: boolean;
  effectIds: string[];
};

export type SkillEffectTextView = {
  name: string;
  description: string | null;
  suffix: string | null;
};

export type SkillEffectView = {
  id: string;
  category: SkillEffectCategory;
  iconName: string | null;
  text: SkillEffectTextView | null;
  fallbackText: SkillEffectTextView | null;
};

export type StudentSkillsView = {
  skills: StudentSkillView[];
  effects: Record<string, SkillEffectView>;
};

function pick<T extends { locale: SkillLocale }>(texts: T[]): T | null {
  for (const locale of TEXT_LOCALES) {
    const text = texts.find((t) => t.locale === locale);
    if (text) {
      return text;
    }
  }

  return null;
}

export async function findStudentSkills(
  studentId: string,
): Promise<StudentSkillsView> {
  const rows = await db.studentSkill.findMany({
    where: { studentId },
    orderBy: { sortOrder: "asc" },
    include: {
      texts: {
        where: { locale: { in: TEXT_LOCALES } },
      },
      effects: {
        select: {
          effect: {
            include: {
              texts: {
                where: { locale: { in: TEXT_LOCALES } },
              },
            },
          },
        },
      },
    },
  });

  const effects: Record<string, SkillEffectView> = {};
  const skills: StudentSkillView[] = [];

  for (const row of rows) {
    const text = pick(row.texts);
    if (!text) {
      continue;
    }

    for (const { effect } of row.effects) {
      const textIn = (locale: SkillLocale): SkillEffectTextView | null => {
        const effectText = effect.texts.find((t) => t.locale === locale);
        return effectText
          ? {
              name: effectText.name,
              description: effectText.description,
              suffix: effectText.suffix,
            }
          : null;
      };

      effects[effect.id] ??= {
        id: effect.id,
        category: effect.category,
        iconName: effect.iconName,
        text: textIn(TEXT_LOCALES[0]),
        fallbackText: textIn(TEXT_LOCALES[1]),
      };
    }

    skills.push({
      id: row.id,
      type: row.type,
      source: row.source,
      sortOrder: row.sortOrder,
      formIndices: row.formIndices,
      requiredWeaponGrade: row.requiredWeaponGrade,
      requiredGearTier: row.requiredGearTier,
      upgradeOfId: row.upgradeOfId,
      parentId: row.parentId,
      iconName: row.iconName,
      maxLevel: row.maxLevel,
      costs: row.costs,
      name: text.name,
      templates: text.templates,
      levelTemplates: text.levelTemplates,
      params: text.params as string[][],
      useCondition: text.useCondition,
      isFallback: text.locale !== TEXT_LOCALES[0],
      effectIds: row.effects.map(({ effect }) => effect.id),
    });
  }

  return { skills, effects };
}
