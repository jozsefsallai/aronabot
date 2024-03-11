import 'dotenv/config';

import axios from 'axios';
import * as cheerio from 'cheerio';

import { Mission } from '../models/Mission';

interface RawMission extends Omit<Mission, 'difficulty' | 'terrain'> {
  difficulty?: string | null;
  terrain?: string | null;
}

const MISSIONS_LIST_URL = 'https://bluearchive.wiki/wiki/Missions';

const missions = new Map<string, RawMission>();

async function getMissionMap(name: string) {
  const response = await axios.get(`${MISSIONS_LIST_URL}/${name}`);
  const $ = cheerio.load(response.data);

  const image = $('.wikitable .mw-default-size a img.mw-file-element').attr(
    'src',
  );

  if (!image) {
    return null;
  }

  return `https:${image}`;
}

function getDrops($: cheerio.CheerioAPI, row: cheerio.Element) {
  const drops = [];

  const columns = $(row).find('td').toArray().slice(5);

  for (const column of columns) {
    const linkElement = $(column).find('a');

    if (!linkElement) {
      continue;
    }

    const dropName = linkElement.attr('title');

    if (!dropName) {
      continue;
    }

    drops.push(dropName);
  }

  return drops;
}

function parseMissionRow($: cheerio.CheerioAPI, row: cheerio.Element) {
  const details: Partial<RawMission> = {};

  details.name = $(row).find('td:nth-child(1)').text().trim();

  if (!details.name) {
    return null;
  }

  details.cost = parseInt($(row).find('td:nth-child(2)').text().trim());
  details.difficulty = $(row).find('td:nth-child(3)').text().trim();
  details.terrain = $(row).find('td:nth-child(4)').text().trim();
  details.recommendedLevel = parseInt(
    $(row).find('td:nth-child(5)').text().trim(),
  );
  details.drops = getDrops($, row);

  missions.set(details.name, details as RawMission);

  return details.name;
}

async function populateMissions() {
  const response = await axios.get(MISSIONS_LIST_URL);
  const $ = cheerio.load(response.data);

  const rows = $('.wikitable tbody tr').toArray();

  for await (const row of rows) {
    const name = parseMissionRow($, row);

    if (!name) {
      continue;
    }

    const image = await getMissionMap(name);

    if (image) {
      missions.get(name)!.stageImageUrl = image;
    }

    console.log(`Scraped mission data for ${name}.`);
  }
}

function normalizeMissions() {
  for (const [_, missionDetails] of missions) {
    for (const [key, value] of Object.entries(missionDetails)) {
      if (typeof value === 'string') {
        (missionDetails as any)[key] = value.trim();
      }

      if (Array.isArray(value)) {
        (missionDetails as any)[key] = value.map((item) => item.trim());
      }
    }
  }
}

async function saveMissionsData() {
  console.log('Saving missions data to the database...');

  const data = Array.from(missions.values());
  const promises = [];

  for (const mission of data) {
    const data = Mission.fromJSON(mission);
    promises.push(data.save());
  }

  try {
    await Promise.all(promises);
    console.log('Missions data saved.');
  } catch (error) {
    console.error('Error saving missions data:', error);
  }
}

async function main() {
  await populateMissions();
  normalizeMissions();
  await saveMissionsData();

  console.log('Done!');
}

main().catch(console.error);
