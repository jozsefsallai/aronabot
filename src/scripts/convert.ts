import 'dotenv/config';

import { studentContainer } from '../containers/students';
import { Storage } from '../utils/storage';
import { Student } from '../models/Student';

import sharp from 'sharp';

const storage = Storage.getInstance();

async function convertWEBPToPNG(student: Student) {
  const webpKey = `images/students/icons/${student.key}.webp`;
  const pngKey = `images/students/icons/${student.key}.png`;
  const data = await storage.read(webpKey);

  if (!data) {
    return;
  }

  const png = await sharp(data).png().toBuffer();
  await storage.upload({
    key: pngKey,
    data: png,
    mimeType: 'image/png',
  });

  console.log(`Converted ${student.name} icon to PNG.`);
}

async function main() {
  await studentContainer.bootstrap();

  const students = studentContainer.all();
  await Promise.all(Object.values(students).map(convertWEBPToPNG));

  console.log('Done.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
