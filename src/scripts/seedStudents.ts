import dotenv from "dotenv";
dotenv.config();

import type { SkillType } from "@prisma/client";

import { t } from "../utils/localizeTable";
import { db } from "../db/client";
import {
  fetchStudentsData,
  type RawStudentData,
  type RawStudentSkillsData,
} from "./common";

const BUFFNAME_RE = /<([bcds])*:([a-zA-Z0-9_]+)>/g;
const PARAMS_RE = /<\?(\d)+>/g;

function kindToLocalizeKey(kind: string): string {
  switch (kind) {
    case "b":
      return "Buff";
    case "c":
      return "CC";
    case "d":
      return "Debuff";
    case "s":
      return "Special";
    default:
      throw new Error(`Unknown buff kind: ${kind}`);
  }
}

function serializeSkillDescription(
  template: string,
  params: Array<string[]>,
): string {
  let output = template
    .split("<b>")
    .join("**")
    .split("</b>")
    .join("**")
    .split("<i>")
    .join("*")
    .split("</i>")
    .join("*")
    .split(/<br\s?\/?>/g)
    .join("\n");

  output = output.replace(BUFFNAME_RE, (_, kind, name) => {
    const prefix = kindToLocalizeKey(kind);
    const localizedBuffName = t(`buffName.${prefix}_${name}` as any);
    return `**${localizedBuffName}**`;
  });

  output = output.replace(PARAMS_RE, (_, idx) => {
    const paramValue = params[Number.parseInt(idx, 10) - 1];
    const lowerBound = paramValue.find(
      (v) => typeof v !== "undefined" && v !== null,
    );
    const upperBound = paramValue[paramValue.length - 1];
    const paramString =
      lowerBound === upperBound
        ? `**${lowerBound}**`
        : `**${lowerBound}~${upperBound}**`;
    return paramString;
  });

  return output;
}

function serializeCost(cost?: number[]): string | null {
  if (!cost) {
    return null;
  }

  const uniqueCosts = Array.from(new Set(cost))
    .filter((v) => typeof v !== "undefined" && v !== null)
    .sort()
    .map((v) => v.toString());

  if (uniqueCosts.length === 0) {
    return null;
  }

  if (uniqueCosts.length === 1) {
    return uniqueCosts[0];
  }

  const min = uniqueCosts[0];
  const max = uniqueCosts[uniqueCosts.length - 1];
  return `${min}~${max}`;
}

async function seedSkills(studentId: string, skillData: RawStudentSkillsData) {
  const { Ex, Public, Passive, ExtraPassive } = skillData;

  await db.skill.createMany({
    data: [
      {
        name: Ex.Name,
        description: serializeSkillDescription(Ex.Desc, Ex.Parameters),
        type: "EX",
        cost: serializeCost(Ex.Cost),
        studentId,
      },
      ...(Ex.ExtraSkills ?? []).map((extraSkill) => ({
        name: extraSkill.Name,
        description: serializeSkillDescription(
          extraSkill.Desc,
          extraSkill.Parameters,
        ),
        type: "EX" as SkillType,
        cost: serializeCost(extraSkill.Cost),
        studentId,
      })),
      {
        name: Public.Name,
        description: serializeSkillDescription(Public.Desc, Public.Parameters),
        type: "Basic",
        cost: null,
        studentId,
      },
      {
        name: Passive.Name,
        description: serializeSkillDescription(
          Passive.Desc,
          Passive.Parameters,
        ),
        type: "Enhanced",
        cost: null,
        studentId,
      },
      {
        name: ExtraPassive.Name,
        description: serializeSkillDescription(
          ExtraPassive.Desc,
          ExtraPassive.Parameters,
        ),
        type: "Sub",
        cost: null,
        studentId,
      },
    ],
  });
}

function sortAltsLast(a: RawStudentData, b: RawStudentData) {
  const aIsAlt = a.Name.includes("(");
  const bIsAlt = b.Name.includes("(");

  if (aIsAlt && !bIsAlt) {
    return 1;
  }

  if (!aIsAlt && bIsAlt) {
    return -1;
  }

  return 0;
}

async function seedStudents() {
  const studentsData = await fetchStudentsData();
  const rawStudents = Object.values(studentsData).sort(sortAltsLast);

  for await (const data of rawStudents) {
    const baseVariantId = data.Name.includes("(")
      ? rawStudents.find(
          (s) =>
            data.PathName.startsWith(s.PathName) &&
            s.PathName !== data.PathName,
        )?.PathName
      : null;

    let student = await db.student.findUnique({
      where: {
        id: data.PathName,
      },
    });

    if (!student) {
      student = await db.student.create({
        data: {
          id: data.PathName,
          devName: data.DevName,
          schaleDbId: data.Id,
          name: data.Name,
          firstName: data.PersonalName,
          lastName: data.FamilyName,
          school: data.School,
          club: data.Club,
          age: data.CharacterAge,
          birthday: data.Birthday,
          introduction: data.ProfileIntroduction,
          hobbies: data.Hobby,
          voiceActor: data.CharacterVoice,
          illustrator: data.Illustrator,
          designer: data.Designer,
          height: data.CharHeightMetric,
          memorobiLevel: data.MemoryLobby.length > 0 ? data.MemoryLobby[0] : 0,
          attackType: data.BulletType,
          defenseType: data.ArmorType,
          combatClass: data.SquadType,
          combatRole: data.TacticRole,
          combatPosition: data.Position,
          streetBattleAdaptation: data.StreetBattleAdaptation,
          outdoorBattleAdaptation: data.OutdoorBattleAdaptation,
          indoorBattleAdaptation: data.IndoorBattleAdaptation,
          usesCover: data.Cover,
          weaponType: data.WeaponType,
          rarity: data.StarGrade,
          isLimited: data.IsLimited === 1 || data.IsLimited === 3,
          isWelfare: data.IsLimited === 2,
          isFest: data.IsLimited === 3,
          isReleasedJP: data.IsReleased[0],
          isReleasedGlobal: data.IsReleased[1],
          isReleasedCN: data.IsReleased[2],
          equipment: data.Equipment,
          baseVariantId,
        },
      });
    } else {
      student = await db.student.update({
        where: {
          id: data.PathName,
        },
        data: {
          devName: data.DevName,
          schaleDbId: data.Id,
          name: data.Name,
          firstName: data.PersonalName,
          lastName: data.FamilyName,
          school: data.School,
          club: data.Club,
          age: data.CharacterAge,
          birthday: data.Birthday,
          introduction: data.ProfileIntroduction,
          hobbies: data.Hobby,
          voiceActor: data.CharacterVoice,
          illustrator: data.Illustrator,
          designer: data.Designer,
          height: data.CharHeightMetric,
          memorobiLevel: data.MemoryLobby.length > 0 ? data.MemoryLobby[0] : 0,
          attackType: data.BulletType,
          defenseType: data.ArmorType,
          combatClass: data.SquadType,
          combatRole: data.TacticRole,
          combatPosition: data.Position,
          streetBattleAdaptation: data.StreetBattleAdaptation,
          outdoorBattleAdaptation: data.OutdoorBattleAdaptation,
          indoorBattleAdaptation: data.IndoorBattleAdaptation,
          usesCover: data.Cover,
          weaponType: data.WeaponType,
          rarity: data.StarGrade,
          isLimited: data.IsLimited === 1 || data.IsLimited === 3,
          isWelfare: data.IsLimited === 2,
          isFest: data.IsLimited === 3,
          isReleasedJP: data.IsReleased[0],
          isReleasedGlobal: data.IsReleased[1],
          isReleasedCN: data.IsReleased[2],
          equipment: data.Equipment,
        },
      });
    }

    await db.skill.deleteMany({
      where: {
        studentId: student.id,
      },
    });

    await seedSkills(student.id, data.Skills);

    console.log(`Seeded student: ${student.name}`);
  }
}

seedStudents()
  .then(() => {
    console.log("All students seeded successfully.");
  })
  .catch((error) => {
    console.error("Error seeding students:", error);
  });
