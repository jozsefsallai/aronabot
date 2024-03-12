import 'dotenv/config';

import axios from 'axios';
import * as cheerio from 'cheerio';

import { denormalizeName } from './common/studentNames';

import { Skill } from '../models/Skill';
import { Student } from '../models/Student';

export interface RawSkill extends Omit<Skill, 'kind'> {
  kind: string;
}

const CHARACTER_URL = 'https://bluearchive.wiki/wiki';

const studentMap = new Map<string, Student>();

const skillTypes = {
  'EX Skill': 'ex',
  'Normal Skill': 'basic',
  'Passive Skill': 'enhanced',
  'Sub Skill': 'sub',
  0: 'ex',
  1: 'basic',
  2: 'enhanced',
  3: 'sub',
} as any;

function makeSkill(
  $: cheerio.CheerioAPI,
  idx: number,
  skillElement: cheerio.Element,
) {
  const skillData: Partial<RawSkill> = {
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
  skillData.name = name.split('•').pop()?.trim();

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

async function getSkillsForStudent(studentKey: string) {
  const student = studentMap.get(studentKey);
  const nameIdentifier = denormalizeName(student!.name).replace(/\s/g, '_');
  const url = `${CHARACTER_URL}/${nameIdentifier}`;

  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const skills: Partial<RawSkill>[] = [];

  const skillData = $('.skilltable .summary').toArray();

  for (let i = 0; i < skillData.length; ++i) {
    const skillElement = skillData[i];
    const skill = makeSkill($, i, skillElement);

    if (skill) {
      skills.push(skill);
    }
  }

  await Skill.deleteAllForStudent(studentKey);

  for await (const skill of skills) {
    const data = Skill.fromJSON(skill);
    await data.save(studentKey);
  }

  console.log(`Scraped skills for ${student!.name}.`);
}

async function populateStudentSkills(scrapeAll: boolean) {
  for await (const [key, student] of studentMap) {
    if (!scrapeAll && (student.skills?.length ?? 0) > 0) {
      continue;
    }

    await getSkillsForStudent(key);
  }
}

async function loadStudentMap() {
  const students = await Student.all();

  for (const student of students) {
    studentMap.set(student.key, student);
  }
}

async function main() {
  const scrapeAll = process.argv.includes('--all');

  await loadStudentMap();
  await populateStudentSkills(scrapeAll);

  console.log('Done!');
}

main().catch(console.error);
