import { Gift } from '../models/Gift';

export class GiftContainer {
  private gifts: Gift[] = [];

  async bootstrap(): Promise<void> {
    await this.reload();
  }

  async reload(): Promise<void> {
    this.gifts = await Gift.all();
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
