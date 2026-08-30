import type { BannerKind } from "../db/client";
import redis from "../utils/redis";

class GachaPullsManager {
  private static readonly GLOBAL_PREFIX = "gacha_pulls";
  private static readonly JP_PREFIX = "gacha_pulls_jp";
  private static readonly PULLS_KEY = "{{prefix}}:{{guildId}}:{{userId}}";

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
    const pulls = Number.parseInt(current, 10) + 10;

    await redis.set(key, pulls);

    return pulls;
  }

  async resetAll(bannerKind: BannerKind): Promise<boolean> {
    if (!redis) {
      return false;
    }

    const stream = redis.scanStream({
      match: `${this.getPrefix(bannerKind)}:*`,
      count: 100,
    });
    const pipeline = redis.pipeline();

    stream.on("data", (keys: string[]) => {
      for (const key of keys) {
        pipeline.set(key, 0);
      }
    });

    await new Promise<void>((resolve, reject) => {
      stream.on("end", resolve);
      stream.on("error", reject);
    });

    await pipeline.exec();
    return true;
  }

  private getPrefix(bannerKind: BannerKind) {
    switch (bannerKind) {
      case "Global":
        return GachaPullsManager.GLOBAL_PREFIX;
      case "JP":
        return GachaPullsManager.JP_PREFIX;
    }
  }

  private makeKey(bannerKind: BannerKind, guildId: string, userId: string) {
    return GachaPullsManager.PULLS_KEY.replace(
      "{{prefix}}",
      this.getPrefix(bannerKind),
    )
      .replace("{{guildId}}", guildId)
      .replace("{{userId}}", userId);
  }
}

const gachaPullsManager = new GachaPullsManager();
export default gachaPullsManager;
