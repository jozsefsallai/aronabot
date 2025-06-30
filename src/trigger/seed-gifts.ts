import { logger, task } from "@trigger.dev/sdk";

import axios from "axios";

import type { ItemRarity } from "@prisma/client";
import { db } from "../db/client";
import { fetchStudentsData } from "./lib/common";

const ITEMS_TABLE = "https://schaledb.com/data/en/items.min.json";

type RawItemData = {
  Category: string;
};

type RawGiftItemData = RawItemData & {
  Id: number;
  Rarity: ItemRarity;
  Quality: number;
  Tags: string[];
  Name: string;
  Desc: string;
  ExpValue: number;
  Icon: string;
};

const commonFavorItemTags = ["BC", "Bc", "ew"];

async function fetchGifts() {
  const { data } = await axios.get<Record<string, RawItemData>>(ITEMS_TABLE);

  for (const key in data) {
    if (data[key].Category !== "Favor") {
      delete data[key];
    }
  }

  return data as Record<string, RawGiftItemData>;
}

async function setFavorGifts(allGifts: RawGiftItemData[]) {
  const studentsData = await fetchStudentsData();
  const allStudents = Object.values(studentsData);

  const sortedGifts = allGifts.sort((a, b) => b.ExpValue - a.ExpValue);

  for await (const item of allStudents) {
    const student = await db.student.findUnique({
      where: {
        id: item.PathName,
      },
    });

    if (!student) {
      continue;
    }

    const adoredGiftIds: number[] = [];
    const lovedGiftIds: number[] = [];
    const likedGiftIds: number[] = [];

    for (const gift of sortedGifts) {
      const allTags = [
        ...item.FavorItemTags,
        ...item.FavorItemUniqueTags,
        ...commonFavorItemTags,
      ];

      const commonTagCount = gift.Tags.filter((tag) =>
        commonFavorItemTags.includes(tag),
      ).length;
      const commonTags = gift.Tags.filter((tag) => allTags.includes(tag));

      const favorGrade = Math.min(commonTags.length, 3);

      if (favorGrade - commonTagCount > 0) {
        switch (favorGrade) {
          case 1:
            likedGiftIds.push(gift.Id);
            break;
          case 2:
            lovedGiftIds.push(gift.Id);
            break;
          case 3:
            adoredGiftIds.push(gift.Id);
            break;
        }
      }
    }

    await db.student.update({
      where: {
        id: item.PathName,
      },
      data: {
        giftsAdored: {
          set: adoredGiftIds.map((id) => ({
            id,
          })),
        },

        giftsLoved: {
          set: lovedGiftIds.map((id) => ({
            id,
          })),
        },

        giftsLiked: {
          set: likedGiftIds.map((id) => ({
            id,
          })),
        },
      },
    });

    logger.info(`Set favor gifts for student: ${item.Name}`);
  }
}

async function seedGifts() {
  const gifts = await fetchGifts();
  const allGifts = Object.values(gifts);

  for await (const item of allGifts) {
    let gift = await db.gift.findUnique({
      where: {
        id: item.Id,
      },
    });

    if (!gift) {
      gift = await db.gift.create({
        data: {
          id: item.Id,
          name: item.Name,
          description: item.Desc,
          iconName: item.Icon,
          rarity: item.Rarity,
          expValue: item.ExpValue,
        },
      });

      logger.info(`Created gift: ${item.Name}`);
    } else {
      gift = await db.gift.update({
        where: {
          id: item.Id,
        },
        data: {
          name: item.Name,
          description: item.Desc,
          iconName: item.Icon,
          rarity: item.Rarity,
          expValue: item.ExpValue,
        },
      });

      logger.info(`Updated gift: ${item.Name}`);
    }
  }

  setFavorGifts(allGifts);
}

export const seedGiftsTask = task({
  id: "seed-gifts",
  run: async () => {
    await seedGifts();
    logger.info("Gifts seeded successfully");
  },
});
