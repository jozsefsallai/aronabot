import type { Gift, Student } from "@prisma/client";
import { db } from "../db/client";

export type DetailedGift = Gift & {
  adoredBy: Student[];
  lovedBy: Student[];
  likedBy: Student[];
};

export class GiftContainer {
  private gifts: DetailedGift[] = [];

  async bootstrap(): Promise<void> {
    await this.reload();
  }

  async reload(): Promise<void> {
    this.gifts = await db.gift.findMany({
      include: {
        adoredBy: true,
        lovedBy: true,
        likedBy: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  getGifts(): Gift[] {
    return this.gifts;
  }

  getGiftWithName(name: string): DetailedGift | null {
    const finalName = name.toLowerCase();
    return (
      this.gifts.find((gift) => gift.name.toLowerCase() === finalName) || null
    );
  }

  findManyByName(name: string): DetailedGift[] {
    return this.gifts.filter((gift) =>
      gift.name.toLowerCase().includes(name.toLowerCase()),
    );
  }
}

export const giftContainer = new GiftContainer();
