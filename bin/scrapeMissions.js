const axios = require('axios').default;
const cheerio = require('cheerio');

const fs = require('fs');
const path = require('path');

const MISSIONS_DB_PATH = path.join(__dirname, '..', 'data/missions.json');

const MISSIONS_LIST_URL = 'https://bluearchive.wiki/wiki/Missions';

const missions = new Map();

async function getMissionMap(name) {
  const response = await axios.get(`${MISSIONS_LIST_URL}/${name}`);
  const $ = cheerio.load(response.data);

  const image = $('a.image img').attr('src');

  if (!image) {
    return null;
  }

  return `https:${image}`;
}

function getDrops($, row) {
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

function parseMissionRow($, row) {
  const details = {};

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

  missions.set(details.name, details);

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
      missions.get(name).stageImageUrl = image;
    }

    console.log(`Scraped mission data for ${name}.`);
  }
}

function normalizeMissions() {
  for (const [_, missionDetails] of missions) {
    for (const [key, value] of Object.entries(missionDetails)) {
      if (typeof value === 'string') {
        missionDetails[key] = value.trim();
      }

      if (Array.isArray(value)) {
        missionDetails[key] = value.map((item) => item.trim());
      }
    }
  }
}

function saveMissionsData() {
  const data = Array.from(missions.values());
  fs.writeFileSync(MISSIONS_DB_PATH, JSON.stringify(data, null, 2));
}

async function main() {
  await populateMissions();
  normalizeMissions();
  saveMissionsData();

  console.log('Done!');
}

main().catch(console.error);
