import { Gift } from '../models/Gift';

import * as path from 'path';
import * as fs from 'fs';

export class GiftContainer {
  private gifts: Gift[] = [];

  constructor() {
    this.bootstrap();
  }

  bootstrap(): void {
    const giftsDatabasePath = path.join(__dirname, '../..', 'data/gifts.json');

    if (!fs.existsSync(giftsDatabasePath)) {
      throw new Error('Gifts database not found! Please generate it first.');
    }

    const data = fs.readFileSync(giftsDatabasePath, 'utf8');
    const gifts = JSON.parse(data);

    for (const gift of gifts) {
      this.addGift(Gift.fromJSON(gift));
    }
  }

  addGift(gift: Gift): void {
    this.gifts.push(gift);
  }

  getGifts(): Gift[] {
    return this.gifts;
  }

  getGiftWithName(name: string): Gift | null {
    name = name.toLowerCase();
    return this.gifts.find((gift) => gift.name.toLowerCase() === name) || null;
  }

  findManyByName(name: string): Gift[] {
    return this.gifts.filter((gift) =>
      gift.name.toLowerCase().includes(name.toLowerCase()),
    );
  }
}

export const giftContainer = new GiftContainer();
