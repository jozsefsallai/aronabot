import 'dotenv/config';

import axios from 'axios';
import * as cheerio from 'cheerio';

import { generateKey, normalizeName } from './common/studentNames';

import { Student } from '../models/Student';
import { RawSkill } from './scrapeSkills';

import { Storage } from '../utils/storage';

const storage = Storage.getInstance();

const IGNORED_STUDENTS = process.env.IGNORE_STUDENTS?.split(',') ?? [];

interface RawStudent
  extends Omit<
    Student,
    | 'skills'
    | 'rarity'
    | 'attackType'
    | 'defenseType'
    | 'combatClass'
    | 'combatRole'
    | 'school'
    | 'combatPosition'
    | 'weaponType'
    | 'releaseDate'
  > {
  skills?: RawSkill[];
  rarity?: number;
  attackType?: string;
  defenseType?: string;
  combatClass?: string;
  combatRole?: string;
  school?: string;
  combatPosition?: string;
  weaponType?: string;
  releaseDate?: string;
}

const now = new Date().getTime(); // you should cache-invalidate yourself, NOW

const CHARACTER_LIST_URL = `https://bluearchive.wiki/wiki/Characters?ts=${now}`;
const CHARACTER_TRIVIA_URL = `https://bluearchive.wiki/wiki/Characters_trivia_list?ts=${now}`;
const STUDENT_ICON_BASE_URL =
  'https://bluearchive.page/resource/image/students';

const studentMap = new Map<string, RawStudent>();

function getWikiImage($: cheerio.CheerioAPI, row: cheerio.Element) {
  const url = $(row).find('td:nth-child(1) img').attr('src');

  if (!url) {
    return;
  }

  return 'https:' + url.split('/').slice(0, -1).join('/').replace('/thumb', '');
}

function parseStudentRow($: cheerio.CheerioAPI, row: cheerio.Element) {
  const name = normalizeName($(row).find('td:nth-child(2)').text());

  if (!name) {
    return;
  }

  console.log(`Scraping ${name}...`);

  const key = generateKey(name);

  if (IGNORED_STUDENTS.includes(key)) {
    console.log(`Ignoring ${name}...`);
    return;
  }

  const studentDetails = {
    name,
  } as RawStudent;

  const rowClassNames = ($(row).attr('class') ?? '').split(' ');

  for (const className of rowClassNames) {
    if (className.startsWith('attack-')) {
      studentDetails.attackType = className.replace('attack-', '');
    }

    if (className.startsWith('armor-')) {
      studentDetails.defenseType = className.replace('armor-', '');
    }

    if (className.startsWith('class-')) {
      studentDetails.combatClass = className.replace('class-', '');
    }

    if (className.startsWith('role-')) {
      studentDetails.combatRole = className.replace('role-', '');
    }

    if (className.startsWith('school-')) {
      studentDetails.school = className.replace('school-', '');
    }

    if (className.startsWith('rarity-')) {
      studentDetails.rarity = parseInt(className.replace('rarity-', ''));
    }

    if (className === 'pool-limited' || className === 'pool-anniversary') {
      studentDetails.isLimited = true;
    }

    if (className === 'pool-event') {
      studentDetails.isWelfare = true;
    }
  }

  const wikiImage = getWikiImage($, row);
  if (wikiImage) {
    studentDetails.wikiImage = wikiImage;
  }

  studentDetails.combatPosition = $(row).find('td:nth-child(6)').text();
  studentDetails.weaponType = $(row).find('td:nth-child(10)').text();
  studentDetails.usesCover =
    $(row).find('td:nth-child(11)').text().trim() === 'Yes';

  studentDetails.releaseDate = $(row).find('td:nth-child(15)').text();

  studentMap.set(key, studentDetails);
}

async function populateStudents() {
  const res = await axios.get(CHARACTER_LIST_URL);
  const $ = cheerio.load(res.data);

  const studentList = $('.charactertable tbody tr').toArray();

  for (const row of studentList) {
    parseStudentRow($, row);
  }
}

function parseStudentTriviaRow($: cheerio.CheerioAPI, row: cheerio.Element) {
  const name = normalizeName($(row).find('td:nth-child(1)').text());

  if (!name) {
    return;
  }

  const key = generateKey(name);

  const studentDetails = studentMap.get(key);

  if (!studentDetails) {
    console.log(`!!! No student details found for ${name}.`);
    return;
  }

  console.log(`Scraping trivia for ${name}...`);

  studentDetails.fullName = $(row).find('td:nth-child(3)').text();
  studentDetails.age = $(row).find('td:nth-child(5)').text();
  studentDetails.birthday = $(row).find('td:nth-child(6)').text();
  studentDetails.height = $(row).find('td:nth-child(7)').text();
  studentDetails.hobbies = $(row).find('td:nth-child(8)').text();

  studentMap.set(key, studentDetails);
}

async function populateStudentTrivia() {
  const res = await axios.get(CHARACTER_TRIVIA_URL);
  const $ = cheerio.load(res.data);

  const studentList = $('.wikitable tbody tr').toArray();

  for (const row of studentList) {
    parseStudentTriviaRow($, row);
  }
}

function normalizeDetails() {
  for (const [_, studentDetails] of studentMap) {
    for (const [key, value] of Object.entries(studentDetails)) {
      if (typeof value === 'string') {
        (studentDetails as any)[key] = value.trim();
      }
    }
  }
}

async function saveStudentData() {
  console.log('Saving student data to the database...');

  const data = Array.from(studentMap.entries());
  const promises = [];

  for (const [key, student] of data) {
    const data = Student.fromJSON(key, student);
    promises.push(
      (async () => {
        await data.save();
        return Student.getFromDB(key);
      })(),
    );
  }

  const students = await Promise.all(promises);

  console.log(`Saved ${students.length} students to the database.`);

  for (const student of students) {
    if (!student) {
      continue;
    }

    if (!student.skills) {
      console.warn(
        `No skill data found for ${student.name}, consider re-fetching.`,
      );
    }
  }
}

function normalizeStudentIconName(key: string) {
  key = key
    .replace('swimsuit', 'mizugi')
    .replace('cycling', 'riding')
    .replace('track', 'gym')
    .replace('cheer_squad', 'cheerleader')
    .replace('small', 'lori');

  if (key.includes('arisu')) {
    key = key.replace('arisu', 'alice');
  }

  if (key.includes('hatsune_miku')) {
    key = key.replace('hatsune_miku', 'miku');
  }

  if (key.includes('bunny_girl') && !key.includes('toki')) {
    key = key.replace('bunny_girl', 'bunny');
  }

  if (
    key.includes('mizugi') &&
    [
      'hanako',
      'hinata',
      'koharu',
      'mimori',
      'miyako',
      'miyu',
      'saki',
      'ui',
    ].includes(key.replace('_mizugi', ''))
  ) {
    key = key.replace('mizugi', 'swimsuit');
  }

  return `${key}.webp`;
}

async function fetchStudentIcon(iconName: string) {
  const url = `${STUDENT_ICON_BASE_URL}/${iconName}`;
  const res = await axios.get(url, { responseType: 'arraybuffer' });
  return res.data;
}

async function scrapeStudentIcons() {
  for (const student of studentMap.keys()) {
    const iconName = normalizeStudentIconName(student);
    const iconPath = `images/students/icons/${student}.webp`;

    if (await storage.exists(iconPath)) {
      continue;
    }

    try {
      const buffer = await fetchStudentIcon(iconName);
      const icon = Buffer.from(buffer, 'binary');
      await storage.upload({
        key: iconPath,
        data: icon,
        mimeType: 'image/webp',
      });

      console.log(`Fetched icon for ${student}.`);
    } catch (err) {
      console.log(`!!! Failed to fetch icon for ${student}.`);
      console.error(err);
      continue;
    }
  }
}

async function fetchStudentPortrait(student: RawStudent) {
  if (!student.wikiImage) {
    return null;
  }

  const wikiImage = student.wikiImage;
  const res = await axios.get(wikiImage, { responseType: 'arraybuffer' });
  return res.data;
}

async function scrapeStudentPortraits() {
  for (const [key, student] of studentMap.entries()) {
    try {
      const image = await fetchStudentPortrait(student);
      if (!image) {
        console.log(`No portrait found for ${key}.`);
        continue;
      }

      const portraitPath = `images/students/portraits/${key}.png`;
      if (await storage.exists(portraitPath)) {
        continue;
      }

      await storage.upload({
        key: portraitPath,
        data: image,
        mimeType: 'image/png',
      });

      console.log(`Fetched portrait for ${key}.`);
    } catch (err) {
      console.log(`!!! Failed to fetch portrait for ${key}.`);
      console.error(err);
      continue;
    }
  }
}

async function main() {
  await populateStudents();
  await populateStudentTrivia();

  normalizeDetails();
  await saveStudentData();

  await scrapeStudentIcons();
  await scrapeStudentPortraits();

  console.log('Done.');
}

main().catch(console.error);
