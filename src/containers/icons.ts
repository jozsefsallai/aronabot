import { Storage } from '../utils/storage';
import { studentContainer } from './students';

const storage = Storage.getInstance();

export class IconsContainer {
  private icons: Map<string, string> = new Map();

  private _isReady = false;

  async bootstrap() {
    await this.reload();
  }

  async reload() {
    console.log('Loading student icons from CDN...');

    this._isReady = false;

    const students = studentContainer.all();
    await Promise.all(
      Object.keys(students).map(this.fetchStudentIcon.bind(this)),
    );

    this._isReady = true;

    console.log('Student icons loaded.');
  }

  private async fetchStudentIcon(student: string) {
    const key = `images/students/icons/${student}.png`;
    const data = await storage.read(key);

    if (!data) {
      throw new Error(`Icon not found for ${student}.`);
    }

    const base64 = data.toString('base64');
    this.icons.set(student, base64);
  }

  get isReady() {
    return this._isReady;
  }

  getIcon(student: string) {
    return this.icons.get(student);
  }
}

export const iconsContainer = new IconsContainer();
