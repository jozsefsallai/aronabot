import type { BannerKind } from "@prisma/client";
import redis from "../utils/redis";

class RecruitmentPointsManager {
  private static readonly GLOBAL_PREFIX = "gacha";
  private static readonly JP_PREFIX = "gacha_jp";

  private static readonly POINTS_KEY = "{{prefix}}:{{guildId}}:{{userId}}";

  async get(
    bannerKind: BannerKind,
    guildId: string,
    userId: string,
  ): Promise<number | null> {
    if (!redis) {
      return null;
    }

    const key = this.makeKey(bannerKind, guildId, userId);
    const points = await redis.get(key);

    return points ? Number.parseInt(points, 10) : 0;
  }

  async set(
    bannerKind: BannerKind,
    guildId: string,
    userId: string,
    points: number,
  ): Promise<void> {
    if (!redis) {
      return;
    }

    const key = this.makeKey(bannerKind, guildId, userId);
    await redis.set(key, points);
  }

  async incrementAndGet(
    bannerKind: BannerKind,
    guildId: string,
    userId: string,
  ): Promise<number | null> {
    if (!redis) {
      return null;
    }

    const key = this.makeKey(bannerKind, guildId, userId);

    const current = (await redis.get(key)) ?? "0";
    const points = Number.parseInt(current, 10) + 10;

    await redis.set(key, points);

    return points;
  }

  async resetAll(bannerKind: BannerKind): Promise<boolean> {
    if (!redis) {
      return false;
    }

    const prefix = this.getPrefix(bannerKind);
    const key = `${prefix}:*`;

    const stream = redis.scanStream({
      match: key,
      count: 100,
    });

    const pipeline = redis.pipeline();

    stream.on("data", (keys: string[]) => {
      if (keys.length) {
        keys.forEach((key) => {
          pipeline.set(key, 0);
        });
      }
    });

    await new Promise<void>((resolve, reject) => {
      stream.on("end", () => {
        resolve();
      });
      stream.on("error", (err) => {
        reject(err);
      });
    });

    await pipeline.exec();

    return true;
  }

  private getPrefix(bannerKind: BannerKind) {
    switch (bannerKind) {
      case "Global":
        return RecruitmentPointsManager.GLOBAL_PREFIX;
      case "JP":
        return RecruitmentPointsManager.JP_PREFIX;
    }
  }

  private makeKey(bannerKind: BannerKind, guildId: string, userId: string) {
    return RecruitmentPointsManager.POINTS_KEY.replace(
      "{{prefix}}",
      this.getPrefix(bannerKind),
    )
      .replace("{{guildId}}", guildId)
      .replace("{{userId}}", userId);
  }
}

const recruitmentPointsManager = new RecruitmentPointsManager();
export default recruitmentPointsManager;
