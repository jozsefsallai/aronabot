import { GachaBanner } from '../gacha/banner';

export class BannerContainer {
  private banners: GachaBanner[] = [];

  constructor() {
    this.bootstrap();
  }

  async bootstrap() {
    await this.reload();
  }

  async reload(): Promise<void> {
    this.banners = await GachaBanner.all();
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
