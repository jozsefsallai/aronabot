import * as path from 'path';
import * as fs from 'fs';

import { GachaBanner } from '../gacha/banner';

export class BannerContainer {
  private banners: GachaBanner[] = [];

  constructor() {
    this.bootstrap();
  }

  bootstrap() {
    const bannerDatabasePath = path.join(
      __dirname,
      '../..',
      'data/banners.json',
    );

    if (!fs.existsSync(bannerDatabasePath)) {
      throw new Error('Banner database not found! Please generate it first.');
    }

    const data = fs.readFileSync(bannerDatabasePath, 'utf8');
    const banners = JSON.parse(data);

    for (const bannerData of banners) {
      this.addBanner(GachaBanner.fromJSON(bannerData));
    }
  }

  addBanner(banner: GachaBanner): void {
    this.banners.push(banner);
  }

  all(): GachaBanner[] {
    return this.banners;
  }

  getBanner(id: string): GachaBanner | null {
    return this.banners.find((banner) => banner.id === id) || null;
  }
}

export const bannerContainer = new BannerContainer();
