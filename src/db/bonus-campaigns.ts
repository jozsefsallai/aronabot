import type { BonusCampaign, BonusCampaignType } from "./client";
import { db } from "./index";

export async function findActiveByType(
  type: BonusCampaignType,
  at: Date = new Date(),
): Promise<BonusCampaign | null> {
  return db.bonusCampaign.findFirst({
    where: {
      type,
      startDate: { lte: at },
      endDate: { gt: at },
    },
    orderBy: { bonusMultiply: "desc" },
  });
}
