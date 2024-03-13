import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  varchar,
} from 'drizzle-orm/pg-core';

import { Difficulty } from '../models/Difficulty';
import { Terrain } from '../models/Terrain';
import { AttackType } from '../models/AttackType';
import { CombatClass } from '../models/CombatClass';
import { CombatPosition } from '../models/CombatPosition';
import { CombatRole } from '../models/CombatRole';
import { DefenseType } from '../models/DefenseType';
import { School } from '../models/School';
import { WeaponType } from '../models/WeaponType';
import { SkillType } from '../models/SkillType';
import { BannerKind } from '../gacha/kind';
import {
  DEFAULT_BASE_ONE_STAR_RATE,
  DEFAULT_BASE_THREE_STAR_RATE,
  DEFAULT_BASE_TWO_STAR_RATE,
  DEFAULT_EXTRA_RATE,
  DEFAULT_PICKUP_RATE,
  DEFAULT_THREE_STAR_RATE,
} from '../gacha/constants';

export const difficultyEnum = pgEnum('difficulty', Difficulty.ids());
export const terrainEnum = pgEnum('terrain', Terrain.ids());

export const missions = pgTable('missions', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name').notNull(),
  cost: integer('cost').notNull(),
  difficulty: difficultyEnum('difficulty'),
  terrain: terrainEnum('terrain'),
  recommendedLevel: integer('recommended_level').notNull(),
  drops: text('drops').array().notNull(),
  stageImageUrl: text('stage_image_url'),
});

export const attackTypeEnum = pgEnum('attack_type', AttackType.ids());
export const combatClassEnum = pgEnum('combat_class', CombatClass.ids());
export const combatPositionEnum = pgEnum(
  'combat_position',
  CombatPosition.ids(),
);
export const combatRoleEnum = pgEnum('combat_role', CombatRole.ids());
export const defenseTypeEnum = pgEnum('defense_type', DefenseType.ids());
export const schoolEnum = pgEnum('school', School.ids());
export const weaponTypeEnum = pgEnum('weapon_type', WeaponType.codes());

export const students = pgTable('students', {
  id: varchar('id').primaryKey().notNull(),

  // basic info and trivia
  name: varchar('name').notNull(),
  fullName: varchar('full_name').notNull(),
  school: schoolEnum('school').notNull(),
  age: varchar('age').notNull(),
  birthday: varchar('birthday').notNull(),
  height: varchar('height').notNull(),
  hobbies: text('hobbies'),
  wikiImage: text('wiki_image'),

  // combat info
  attackType: attackTypeEnum('attack_type'),
  defenseType: defenseTypeEnum('defense_type'),
  combatClass: combatClassEnum('combat_class'),
  combatRole: combatRoleEnum('combat_role'),
  combatPosition: combatPositionEnum('combat_position'),
  usesCover: boolean('uses_cover').notNull().default(false),
  weaponType: weaponTypeEnum('weapon_type'),

  // gacha
  rarity: integer('rarity').notNull(),
  isWelfare: boolean('is_welfare').notNull().default(false),
  isLimited: boolean('is_limited').notNull().default(false),

  releaseDate: date('release_date'),
});

export const skillTypeEnum = pgEnum('skill_type', SkillType.codes());

export const skills = pgTable('skills', {
  id: serial('id').primaryKey().notNull(),
  studentId: varchar('student_id')
    .references(() => students.id)
    .notNull(),
  kind: skillTypeEnum('kind').notNull(),
  name: varchar('name').notNull(),
  description: text('description').notNull(),
  cost: varchar('cost'),
});

export const gifts = pgTable('gifts', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name').notNull(),
  iconUrl: text('icon_url'),
  description: text('description'),
  rarity: integer('rarity').notNull().default(1),
  studentsFavorite: varchar('students_favorite').array(),
  studentsLiked: varchar('students_liked').array(),
});

export const bannerKindEnum = pgEnum('banner_kind', [
  BannerKind.GLOBAL,
  BannerKind.JP,
  BannerKind.CHROMA,
]);

export const banners = pgTable('banners', {
  id: varchar('id').primaryKey().notNull(),
  name: varchar('name').notNull(),

  sortKey: integer('sort_key').notNull().default(0),

  date: varchar('date').notNull(),

  threeStarRate: integer('three_star_rate')
    .notNull()
    .default(Math.floor(DEFAULT_THREE_STAR_RATE * 1000)),
  pickupRate: integer('pickup_rate')
    .notNull()
    .default(Math.floor(DEFAULT_PICKUP_RATE * 1000)),
  extraRate: integer('extra_rate')
    .notNull()
    .default(Math.floor(DEFAULT_EXTRA_RATE * 1000)),

  pickupPoolStudents: varchar('pickup_pool_students').array(),
  extraPoolStudents: varchar('extra_pool_students').array(),
  additionalThreeStarStudents: varchar(
    'additional_three_star_students',
  ).array(),

  baseOneStarRate: integer('base_one_star_rate')
    .notNull()
    .default(Math.floor(DEFAULT_BASE_ONE_STAR_RATE * 1000)),
  baseTwoStarRate: integer('base_two_star_rate')
    .notNull()
    .default(Math.floor(DEFAULT_BASE_TWO_STAR_RATE * 1000)),
  baseThreeStarRate: integer('base_three_star_rate')
    .notNull()
    .default(Math.floor(DEFAULT_BASE_THREE_STAR_RATE * 1000)),

  kind: bannerKindEnum('kind').notNull(),
});
