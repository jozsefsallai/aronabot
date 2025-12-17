import type { Gift } from "../db/client";

export function getGiftIcon(gift: Gift): string {
  return `https://schaledb.com/images/item/icon/${gift.iconName}.webp`;
}
