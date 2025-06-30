import axios from "axios";
import * as cheerio from "cheerio";
import type { Mission, MissionDifficulty, Terrain } from "@prisma/client";
import { db } from "../db/client";
import { logger, task } from "@trigger.dev/sdk";

interface RawMission extends Omit<Mission, "difficulty" | "terrain"> {
  difficulty?: string | null;
  terrain?: string | null;
}

const MISSIONS_LIST_URL = "https://bluearchive.wiki/wiki/Missions";

const missions = new Map<string, RawMission>();

function terrainToDbTerrain(
  terrain: string | null | undefined,
): Terrain | null {
  if (!terrain) {
    return null;
  }

  switch (terrain.toLowerCase()) {
    case "indoors":
      return "Indoor";
    case "outdoors":
      return "Outdoor";
    case "urban":
      return "Street";
    default:
      return null;
  }
}

function difficultyToDbDifficulty(
  difficulty: string | null | undefined,
): MissionDifficulty | null {
  if (!difficulty) {
    return null;
  }

  switch (difficulty.toLowerCase()) {
    case "normal":
      return "Normal";
    case "hard":
      return "Hard";
    default:
      return null;
  }
}

async function getMissionMap(name: string) {
  const response = await axios.get(`${MISSIONS_LIST_URL}/${name}`);
  const $ = cheerio.load(response.data);

  const image = $(".wikitable .mw-default-size a img.mw-file-element").attr(
    "src",
  );

  if (!image) {
    return null;
  }

  return `https:${image}`;
}

function getDrops($: cheerio.CheerioAPI, row: cheerio.Element) {
  const drops = [];

  const columns = $(row).find("td").toArray().slice(5);

  for (const column of columns) {
    const linkElement = $(column).find("a");

    if (!linkElement) {
      continue;
    }

    const dropName = linkElement.attr("title");

    if (!dropName) {
      continue;
    }

    drops.push(dropName);
  }

  return drops;
}

function parseMissionRow($: cheerio.CheerioAPI, row: cheerio.Element) {
  const details: Partial<RawMission> = {};

  details.name = $(row).find("td:nth-child(1)").text().trim();

  if (!details.name) {
    return null;
  }

  details.cost = Number.parseInt($(row).find("td:nth-child(2)").text().trim());
  details.difficulty = $(row).find("td:nth-child(3)").text().trim();
  details.terrain = $(row).find("td:nth-child(4)").text().trim();
  details.recommendedLevel = Number.parseInt(
    $(row).find("td:nth-child(5)").text().trim(),
  );
  details.drops = getDrops($, row);

  missions.set(details.name, details as RawMission);

  return details.name;
}

async function populateMissions() {
  const response = await axios.get(MISSIONS_LIST_URL);
  const $ = cheerio.load(response.data);

  const rows = $(".wikitable tbody tr").toArray();

  for await (const row of rows) {
    const name = parseMissionRow($, row);

    if (!name) {
      continue;
    }

    const image = await getMissionMap(name);

    if (image) {
      // biome-ignore lint/style/noNonNullAssertion: it exists
      missions.get(name)!.stageImageUrl = image;
    }

    logger.info(`Scraped mission data for ${name}.`);
  }
}

function normalizeMissions() {
  for (const [_, missionDetails] of missions) {
    for (const [key, value] of Object.entries(missionDetails)) {
      if (typeof value === "string") {
        (missionDetails as any)[key] = value.trim();
      }

      if (Array.isArray(value)) {
        (missionDetails as any)[key] = value.map((item) => item.trim());
      }
    }
  }
}

async function createOrUpdateMission(mission: RawMission) {
  const existingMission = await db.mission.findFirst({
    where: {
      name: mission.name,
    },
  });

  if (existingMission) {
    return db.mission.update({
      where: { id: existingMission.id },
      data: {
        name: mission.name,
        cost: mission.cost,
        difficulty: difficultyToDbDifficulty(mission.difficulty),
        terrain: terrainToDbTerrain(mission.terrain),
        recommendedLevel: mission.recommendedLevel,
        drops: mission.drops,
        stageImageUrl: mission.stageImageUrl,
      },
    });
  }

  return db.mission.create({
    data: {
      name: mission.name,
      cost: mission.cost,
      difficulty: difficultyToDbDifficulty(mission.difficulty),
      terrain: terrainToDbTerrain(mission.terrain),
      recommendedLevel: mission.recommendedLevel,
      drops: mission.drops,
      stageImageUrl: mission.stageImageUrl,
    },
  });
}

async function saveMissionsData() {
  logger.info("Saving missions data to the database...");

  const data = Array.from(missions.values());
  const promises = [];

  for (const mission of data) {
    const promise = createOrUpdateMission(mission);
    promises.push(promise);
  }

  try {
    await Promise.all(promises);
    logger.info("Missions data saved.");
  } catch (error) {
    logger.error(`Error saving missions data: ${error}`);
  }
}

export const seedMissionsTask = task({
  id: "seed-missions",
  run: async () => {
    await populateMissions();
    normalizeMissions();
    await saveMissionsData();
    logger.info("Missions data seeded successfully.");
  },
});
