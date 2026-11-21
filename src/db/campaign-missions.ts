import { z } from "zod";
import type { CampaignMission, MissionDifficulty } from "./client";
import { db } from "./index";

const MissionRewardSchema = z.object({
  tag: z.enum(["FirstClear", "Default", "Rare", "ThreeStar"]),
  parcelType: z.string(),
  parcelId: z.number(),
  amount: z.number(),
  probability: z.number(),
});

export type MissionRewardTag = z.infer<typeof MissionRewardSchema>["tag"];

export interface MissionDrop {
  tag: MissionRewardTag;
  name: string;
  amount: number;
  probability: number;
}

export interface MissionWithDrops {
  label: string;
  mission: CampaignMission;
  drops: MissionDrop[];
}

export function missionLabel(mission: {
  chapter: number;
  stage: number;
  difficulty: MissionDifficulty;
}): string {
  return `${mission.chapter}-${mission.stage}${mission.difficulty === "Hard" ? "H" : ""}`;
}

export function parseMissionLabel(input: string) {
  let label = input.toUpperCase().replace(/\s/g, "").replace("HARD", "H");
  label = label.replace("NORMAL", "").replace(/N$/, "");

  if (label.startsWith("H")) {
    label = `${label.slice(1)}H`;
  }

  const match = label.match(/^(\d+)-(\d+)(H?)$/);
  if (!match) {
    return null;
  }

  return {
    chapter: Number(match[1]),
    stage: Number(match[2]),
    difficulty: (match[3] ? "Hard" : "Normal") as MissionDifficulty,
  };
}

async function resolveDrops(rewards: unknown): Promise<MissionDrop[]> {
  const parsed = z.array(MissionRewardSchema).safeParse(rewards);
  if (!parsed.success) {
    return [];
  }

  const itemRewards = parsed.data.filter(
    (reward) =>
      reward.parcelType === "Item" || reward.parcelType === "Equipment",
  );

  const items = await db.gameItem.findMany({
    where: {
      OR: itemRewards.map((reward) => ({
        parcelType: reward.parcelType as "Item" | "Equipment",
        itemId: reward.parcelId,
      })),
    },
  });

  const itemNames = new Map(
    items.map((item) => [`${item.parcelType}:${item.itemId}`, item.name]),
  );

  return parsed.data.map((reward) => {
    const name =
      reward.parcelType === "Currency"
        ? "Pyroxene"
        : (itemNames.get(`${reward.parcelType}:${reward.parcelId}`) ??
          "Unknown item");

    return {
      tag: reward.tag,
      name,
      amount: reward.amount,
      probability: reward.probability,
    };
  });
}

export async function findByLabel(
  input: string,
): Promise<MissionWithDrops | null> {
  const where = parseMissionLabel(input);
  if (!where) {
    return null;
  }

  const mission = await db.campaignMission.findUnique({
    where: { chapter_difficulty_stage: where },
  });

  if (!mission) {
    return null;
  }

  return {
    label: missionLabel(mission),
    mission,
    drops: await resolveDrops(mission.rewards),
  };
}
