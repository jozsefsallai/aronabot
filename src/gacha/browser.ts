import * as puppeteer from 'puppeteer';
import locateChrome from 'locate-chrome';

export class GachaBrowser {
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

  async getScreenshot(bannerName: string): Promise<Buffer> {
    if (!this.browser) {
      throw new Error('Browser is not initialized');
    }

    const page = await this.browser.newPage();
    await page.setViewport({ width: 1120, height: 640 });

    const PORT = process.env.PORT || 3000;
    await page.goto(`http://localhost:${PORT}/gacha?banner=${bannerName}`);

    const screenshot = await page.screenshot({ type: 'png' });

    await page.close();

    return screenshot;
  }
}
