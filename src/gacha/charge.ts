import type { BannerChargeCategory, BannerKind } from "../db/client";
import redis from "../utils/redis";

class RecruitmentChargeManager {
  private static readonly GLOBAL_PREFIX = "gacha_charge";
  private static readonly JP_PREFIX = "gacha_charge_jp";

  private static readonly CHARGE_CATEGORY_STANDARD = "standard";
  private static readonly CHARGE_CATEGORY_UNIQUE = "unique";
  private static readonly CHARGE_CATEGORY_ANNIVERSARY = "anniversary";

  private static readonly CHARGE_KEY =
    "{{prefix}}:{{category}}:{{guildId}}:{{userId}}";

  async get(
    bannerKind: BannerKind,
    category: BannerChargeCategory,
    guildId: string,
    userId: string,
  ): Promise<number | null> {
    if (!redis) {
      return null;
    }

    const key = this.makeKey(bannerKind, category, guildId, userId);
    const charge = await redis.get(key);

    return charge ? Number.parseInt(charge, 10) : 0;
  }

  async set(
    bannerKind: BannerKind,
    category: BannerChargeCategory,
    guildId: string,
    userId: string,
    charge: number,
  ): Promise<void> {
    if (!redis) {
      return;
    }

    const key = this.makeKey(bannerKind, category, guildId, userId);
    await redis.set(key, charge);
  }

  private getPrefix(bannerKind: BannerKind) {
    switch (bannerKind) {
      case "Global":
        return RecruitmentChargeManager.GLOBAL_PREFIX;
      case "JP":
        return RecruitmentChargeManager.JP_PREFIX;
    }
  }

  private getCategoryKey(category: BannerChargeCategory) {
    switch (category) {
      case "Standard":
        return RecruitmentChargeManager.CHARGE_CATEGORY_STANDARD;
      case "Unique":
        return RecruitmentChargeManager.CHARGE_CATEGORY_UNIQUE;
      case "Anniversary":
        return RecruitmentChargeManager.CHARGE_CATEGORY_ANNIVERSARY;
    }
  }

  private makeKey(
    bannerKind: BannerKind,
    category: BannerChargeCategory,
    guildId: string,
    userId: string,
  ) {
    return RecruitmentChargeManager.CHARGE_KEY.replace(
      "{{prefix}}",
      this.getPrefix(bannerKind),
    )
      .replace("{{category}}", this.getCategoryKey(category))
      .replace("{{guildId}}", guildId)
      .replace("{{userId}}", userId);
  }
}

const recruitmentChargeManager = new RecruitmentChargeManager();
export default recruitmentChargeManager;
