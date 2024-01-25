const axios = require('axios').default;
const cheerio = require('cheerio');

const fs = require('fs');
const path = require('path');

const { denormalizeName } = require('./common/studentNames');
const mapToObject = require('./common/mapToObject');

const STUDENT_DB_PATH = path.join(__dirname, '..', 'data/students.json');

const CHARACTER_URL = 'https://bluearchive.wiki/wiki';

const studentMap = new Map();

const skillTypes = {
  'EX Skill': 'ex',
  'Normal Skill': 'basic',
  'Passive Skill': 'enhanced',
  'Sub Skill': 'sub',
  0: 'ex',
  1: 'basic',
  2: 'enhanced',
  3: 'sub',
};

function makeSkill($, idx, skillElement) {
  const skillData = {
    kind: skillTypes[idx],
    name: '',
    description: '',
    cost: null,
  };

  const firstColumn = $(skillElement).find('td:nth-child(1)').text();
  const skillType = $(skillElement).find('td:nth-child(1) b').text().trim();

  if (skillTypes[skillType]) {
    skillData.kind = skillTypes[skillType];
  }

  if (typeof skillData.kind === 'undefined') {
    return null;
  }

  const costsMatches = firstColumn.match(/Cost \w/gm);
  if (costsMatches) {
    const costs = Array.from(costsMatches).map((cost) =>
      cost.replace('Cost ', '').trim(),
    );

    if (costs.length === 1) {
      skillData.cost = costs[0];
    }

    if (costs.length > 1) {
      const first = costs[0];
      const last = costs[costs.length - 1];
      skillData.cost = `${first}~${last}`;
    }
  }

  const name = $(skillElement).find('td:nth-child(2) p b').text();
  skillData.name = name.split('•').pop().trim();

  // remove the name element from the second column so we can get the description
  $(skillElement).find('td:nth-child(2) p b').remove();

  // surround the text inside every span element with double asterisks
  $(skillElement)
    .find('td:nth-child(2) p span')
    .each((i, span) => {
      $(span).text(`**${$(span).text()}**`);
    });

  const description = $(skillElement).find('td:nth-child(2) p').text();
  skillData.description = description.trim();

  return skillData;
}

async function getSkillsForStudent(studentKey) {
  const student = studentMap.get(studentKey);
  const nameIdentifier = denormalizeName(student.name).replace(/\s/g, '_');
  const url = `${CHARACTER_URL}/${nameIdentifier}`;

  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const skills = [];

  const skillData = $('.skilltable .summary').toArray();

  for (let i = 0; i < skillData.length; ++i) {
    const skillElement = skillData[i];
    const skill = makeSkill($, i, skillElement);

    if (skill) {
      skills.push(skill);
    }
  }

  student.skills = skills;

  studentMap.set(studentKey, student);

  console.log(`Scraped skills for ${student.name}.`);
}

async function populateStudentSkills(scrapeAll) {
  for await (const [key, student] of studentMap) {
    if (!scrapeAll && student.skills) {
      continue;
    }

    await getSkillsForStudent(key);
  }
}

function loadStudentMap() {
  const studentData = fs.readFileSync(STUDENT_DB_PATH, 'utf8');
  const parsedData = JSON.parse(studentData);

  for (const [key, value] of Object.entries(parsedData)) {
    studentMap.set(key, value);
  }
}

function saveStudentData() {
  const studentData = mapToObject(studentMap);
  fs.writeFileSync(STUDENT_DB_PATH, JSON.stringify(studentData, null, 2));
}

async function main() {
  const scrapeAll = process.argv.includes('--all');

  loadStudentMap();
  await populateStudentSkills(scrapeAll);
  saveStudentData();
  console.log('Done!');
}

main().catch(console.error);
