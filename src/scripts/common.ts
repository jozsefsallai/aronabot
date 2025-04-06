import type {
  AttackType,
  Club,
  CombatClass,
  CombatPosition,
  CombatRole,
  DefenseType,
  EquipmentKind,
  School,
  WeaponType,
} from "@prisma/client";

import axios from "axios";

const STUDENTS_TABLE = "https://schaledb.com/data/en/students.min.json";

export type RawEffect = {
  Type: string;
  Scale: number[];
};

export type RawExSkill = {
  Name: string;
  Desc: string;
  Parameters: Array<string[]>;
  Cost?: number[];
  ExtraSkills?: Array<RawExSkill>;
  Effects: Array<RawEffect>;
};

export type RawPassiveSkill = {
  Name: string;
  Desc: string;
  Parameters: Array<string[]>;
  Effects: Array<RawEffect>;
};

export type RawStudentSkillsData = {
  Ex: RawExSkill; // EX skill
  Public: RawPassiveSkill; // Normal skill
  Passive: RawPassiveSkill; // Enhanced skill
  ExtraPassive: RawPassiveSkill; // Subskill
};

export type RawStudentData = {
  Id: number;
  IsReleased: [boolean, boolean, boolean]; // JP, Global, CN
  PathName: string;
  DevName: string;
  Name: string;
  School: School;
  Club: Club;
  StarGrade: number;
  SquadType: CombatClass;
  TacticRole: CombatRole;
  Position: CombatPosition;
  BulletType: AttackType;
  ArmorType: DefenseType;
  StreetBattleAdaptation: number;
  OutdoorBattleAdaptation: number;
  IndoorBattleAdaptation: number;
  WeaponType: WeaponType;
  Cover: boolean;
  Equipment: EquipmentKind[];
  FamilyName: string;
  PersonalName: string;
  CharacterAge: string;
  Birthday: string;
  ProfileIntroduction: string;
  Hobby: string;
  CharacterVoice: string;
  Illustrator: string;
  Designer: string;
  CharHeightMetric: string;
  Skills: RawStudentSkillsData;
  MemoryLobby: number[];
  FavorItemTags: string[];
  FavorItemUniqueTags: string[];
  IsLimited: number; // 0 = Permanent, 1 = Limited, 2 = Welfare, 3 = Fest
  LinkedCharacterId?: number | null;
};

export async function fetchStudentsData(): Promise<
  Record<string, RawStudentData>
> {
  const response = await axios.get(STUDENTS_TABLE);
  return response.data;
}
