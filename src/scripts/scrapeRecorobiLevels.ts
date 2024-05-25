import 'dotenv/config';

import axios from 'axios';
import { studentContainer } from '../containers/students';
import db from '../db';
import { students } from '../db/schema';

import * as cheerio from 'cheerio';
import { generateKey, normalizeName } from './common/studentNames';
import { eq } from 'drizzle-orm';

const RECOROBI_WIKI_URL = 'https://bluearchive.wiki/wiki/Memorial_Lobby';

const levels: Record<string, number | null> = {};

async function prepare() {
  const allStudents = await db.select().from(students);
  for (const student of allStudents) {
    levels[student.id] = student.recorobiLevel;
  }
}

async function saveLevelIfNeeded(key: string, level: number) {
  if (typeof levels[key] === 'undefined') {
    return;
  }

  if (levels[key] === level) {
    return;
  }

  await db
    .update(students)
    .set({ recorobiLevel: level })
    .where(eq(students.id, key));
  console.log(`Updated ${key} recollection lobby unlock level to ${level}.`);
}

async function parseLobbyCard($: cheerio.CheerioAPI, card: cheerio.Element) {
  const name = normalizeName($(card).find('a').text().trim());

  if (!name) {
    return;
  }

  const cardText = $(card).text();

  const matches = /Lv\s*[:：]\s*(?<level>\d)/g.exec(cardText);
  const levelStr = matches?.groups?.['level'];

  if (!levelStr) {
    return;
  }

  const level = parseInt(levelStr, 10);
  if (isNaN(level)) {
    return;
  }

  const key = generateKey(name);
  await saveLevelIfNeeded(key, level);
}

async function scrapeRecorobiLevels() {
  const res = await axios.get(RECOROBI_WIKI_URL);
  const $ = cheerio.load(res.data);

  const lobbyCards = $('.lobbycard').toArray();

  for await (const card of lobbyCards) {
    await parseLobbyCard($, card);
  }
}

async function main() {
  await studentContainer.bootstrap();

  await prepare();
  await scrapeRecorobiLevels();

  console.log('Done.');
}

main().catch(console.error);
