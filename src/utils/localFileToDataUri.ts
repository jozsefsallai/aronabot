import * as fs from 'fs';

export function localFileToDataUri(type: string, filePath: string) {
  const buffer = fs.readFileSync(filePath);
  const mimeType = filePath.split('.').pop();

  if (!mimeType) {
    throw new Error('Invalid file path');
  }

  return `data:${type}/${mimeType};base64,${buffer.toString('base64')}`;
}
