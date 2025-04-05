import type { AttackType, DefenseType, Student } from "@prisma/client";
import { type Birthday, parseBirthday } from "./date";
import { GAME_BLUE, GAME_PURPLE, GAME_RED, GAME_YELLOW } from "./constants";

export function getSchaleDBUrl(student: Student): string {
  return `https://schaledb.com/student/${student.id}`;
}

export function getPortraitUrl(student: Student): string {
  return `${process.env.R2_PUBLIC_ACCESS_URL}/v2/images/students/portraits/${student.id}.png`;
}

export function getStudentBirthdayData(student: Student): Birthday | null {
  return parseBirthday(student.birthday);
}

export function getStudentNextBirthday(student: Student): Date | null {
  const birthday = getStudentBirthdayData(student);
  if (!birthday) {
    return null;
  }

  const today = new Date();

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const nextBirthdayYear =
    currentMonth > birthday.month ? currentYear + 1 : currentYear;
  const nextBirthdayMonth = birthday.month;
  const nextBirthdayDay = birthday.day;

  return new Date(nextBirthdayYear, nextBirthdayMonth, nextBirthdayDay);
}

export function studentHasBirthdayOnMonth(
  student: Student,
  month: number,
): boolean {
  const birthday = getStudentBirthdayData(student);
  if (!birthday) {
    return false;
  }

  return birthday.month === month;
}

export function hasBirthdayThisMonth(student: Student): boolean {
  const today = new Date();
  return studentHasBirthdayOnMonth(student, today.getMonth());
}

export function studentHasBirthdayToday(student: Student): boolean {
  const birthday = getStudentBirthdayData(student);
  if (!birthday) {
    return false;
  }

  const today = new Date();
  return (
    birthday.month === today.getMonth() && birthday.day === today.getDate()
  );
}

export function studentNextBirthdayString(student: Student): string {
  const nextBirthday = getStudentNextBirthday(student);
  if (!nextBirthday) {
    return "N/A";
  }

  const timestamp = nextBirthday.getTime();
  return `<t:${Math.floor(timestamp / 1000)}:R>`;
}

export function getAttackTypeColor(attackType: AttackType) {
  switch (attackType) {
    case "Explosion":
      return GAME_RED;
    case "Pierce":
      return GAME_YELLOW;
    case "Mystic":
      return GAME_BLUE;
    case "Sonic":
      return GAME_PURPLE;
    default:
      return GAME_BLUE;
  }
}

export function getDefenseTypeColor(defenseType: DefenseType) {
  switch (defenseType) {
    case "LightArmor":
      return GAME_RED;
    case "HeavyArmor":
      return GAME_YELLOW;
    case "Unarmed":
      return GAME_BLUE;
    case "ElasticArmor":
      return GAME_PURPLE;
    default:
      return GAME_BLUE;
  }
}
