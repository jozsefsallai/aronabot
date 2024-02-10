import redis from '../utils/redis';
import { BannerKind } from './kind';

class RecruitmentPointsManager {
  private static readonly GLOBAL_PREFIX = 'gacha';
  private static readonly JP_PREFIX = 'gacha_jp';
  private static readonly CHROMA_PREFIX = 'gacha_chroma';

  private static readonly POINTS_KEY = '{{prefix}}:{{guildId}}:{{userId}}';

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

    return points ? parseInt(points, 10) : 0;
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

    const current = (await redis.get(key)) ?? '0';
    const points = parseInt(current, 10) + 10;

    await redis.set(key, points);

    return points;
  }

  private getPrefix(bannerKind: BannerKind) {
    switch (bannerKind) {
      case BannerKind.GLOBAL:
        return RecruitmentPointsManager.GLOBAL_PREFIX;
      case BannerKind.JP:
        return RecruitmentPointsManager.JP_PREFIX;
      case BannerKind.CHROMA:
        return RecruitmentPointsManager.CHROMA_PREFIX;
    }
  }

  private makeKey(bannerKind: BannerKind, guildId: string, userId: string) {
    return RecruitmentPointsManager.POINTS_KEY.replace(
      '{{prefix}}',
      this.getPrefix(bannerKind),
    )
      .replace('{{guildId}}', guildId)
      .replace('{{userId}}', userId);
  }
}

const recruitmentPointsManager = new RecruitmentPointsManager();
export default recruitmentPointsManager;
