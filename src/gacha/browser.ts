import * as puppeteer from 'puppeteer';
import locateChrome from 'locate-chrome';

const PORT = process.env.PORT || 3000;

export class GachaBrowser {
  private static readonly BANNER_URL = `http://localhost:${PORT}/gacha`;

  private browser: puppeteer.Browser | undefined;

  private static _instance: GachaBrowser;

  private constructor() {}

  static async getInstance(): Promise<GachaBrowser> {
    if (!GachaBrowser._instance) {
      GachaBrowser._instance = new GachaBrowser();
      await GachaBrowser._instance.init();
    }

    return GachaBrowser._instance;
  }

  private async init(): Promise<void> {
    const executablePath: string | undefined =
      process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD === 'true'
        ? await new Promise((resolve) =>
            locateChrome((arg: any) => resolve(arg)),
          )
        : undefined;

    this.browser = await puppeteer.launch({
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  async getScreenshot(
    bannerName: string,
    points?: number | null,
  ): Promise<Buffer> {
    if (!this.browser) {
      throw new Error('Browser is not initialized');
    }

    const page = await this.browser.newPage();
    await page.setViewport({ width: 1120, height: 640 });

    const url = this.makeBannerUrl(bannerName, points);
    await page.goto(url);

    const screenshot = await page.screenshot({ type: 'png' });

    await page.close();

    return screenshot;
  }

  private makeBannerUrl(bannerName: string, points?: number | null): string {
    const url = new URL(GachaBrowser.BANNER_URL);

    url.searchParams.set('banner', bannerName);

    if (points) {
      url.searchParams.set('points', points.toString());
    }

    return url.toString();
  }
}
