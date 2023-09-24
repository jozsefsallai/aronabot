const axios = require('axios').default;
const cheerio = require('cheerio');

const fs = require('fs');
const path = require('path');

const STUDENT_DB_PATH = path.join(__dirname, '..', 'data/students.json');
const STUDENT_ICON_PATH = path.join(
  __dirname,
  '..',
  'assets/images/students/icons',
);

const CHARACTER_LIST_URL = 'https://bluearchive.wiki/wiki/Characters';
const CHARACTER_TRIVIA_URL =
  'https://bluearchive.wiki/wiki/Characters_trivia_list';
const STUDENT_ICON_BASE_URL =
  'https://bluearchive.page/resource/image/students';

const studentMap = new Map();

function generateKey(name) {
  return name
    .toLowerCase()
    .replace(/\s/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

function normalizeName(name) {
  return name
    .trim()
    .replace('Sportswear', 'Track')
    .replace('Cheerleader', 'Cheer Squad')
    .replace('Riding', 'Cycling')
    .replace('Kid', 'Small');
}

function getWikiImage($, row) {
  const url = $(row).find('td:nth-child(1) img').attr('src');

  if (!url) {
    return;
  }

  return 'https:' + url.split('/').slice(0, -1).join('/').replace('/thumb', '');
}

function parseStudentRow($, row) {
  const name = normalizeName($(row).find('td:nth-child(2)').text());

  if (!name) {
    return;
  }

  console.log(`Scraping ${name}...`);

  const key = generateKey(name);
  const studentDetails = {
    name,
  };

  const rowClassNames = $(row).attr('class').split(' ');

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

function parseStudentTriviaRow($, row) {
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
        studentDetails[key] = value.trim();
      }
    }
  }
}

function mapToObject(map) {
  const obj = {};

  for (const [key, value] of map) {
    obj[key] = value;
  }

  return obj;
}

function saveStudentData() {
  const studentData = mapToObject(studentMap);
  fs.writeFileSync(STUDENT_DB_PATH, JSON.stringify(studentData, null, 2));
}

function normalizeStudentIconName(key) {
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

async function fetchStudentIcon(iconName) {
  const url = `${STUDENT_ICON_BASE_URL}/${iconName}`;
  const res = await axios.get(url, { responseType: 'arraybuffer' });
  return res.data;
}

async function scrapeStudentIcons() {
  const dirContents = fs.readdirSync(STUDENT_ICON_PATH);

  for (const student of studentMap.keys()) {
    const iconName = normalizeStudentIconName(student);
    const iconPath = path.join(STUDENT_ICON_PATH, `${student}.webp`);

    if (dirContents.includes(`${student}.webp`)) {
      continue;
    }

    try {
      const buffer = await fetchStudentIcon(iconName);
      const icon = Buffer.from(buffer, 'binary');
      fs.writeFileSync(iconPath, icon);

      console.log(`Fetched icon for ${student}.`);
    } catch (err) {
      console.log(`!!! Failed to fetch icon for ${student}.`);
      console.error(err);
      continue;
    }
  }
}

async function main() {
  await populateStudents();
  await populateStudentTrivia();

  normalizeDetails();
  saveStudentData();

  await scrapeStudentIcons();

  console.log('Done.');
}

main().catch(console.error);
