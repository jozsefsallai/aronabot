import * as puppeteer from 'puppeteer';
import locateChrome from 'locate-chrome';

export class GachaBrowser {
  private browser: puppeteer.Browser | undefined;
  private page: puppeteer.Page | undefined;

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
    const executablePath: string =
      (await new Promise((resolve) =>
        locateChrome((arg: any) => resolve(arg)),
      )) || '';

    this.browser = await puppeteer.launch({
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1120, height: 640 });
  }

  async getScreenshot(bannerName: string): Promise<Buffer> {
    if (!this.page) {
      throw new Error('Browser not initialized!');
    }

    const PORT = process.env.PORT || 3000;
    await this.page.goto(`http://localhost:${PORT}/gacha?banner=${bannerName}`);
    return await this.page.screenshot({ type: 'png' });
  }
}
