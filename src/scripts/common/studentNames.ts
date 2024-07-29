export function generateKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s|＊/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

export function normalizeName(name: string): string {
  return name
    .trim()
    .replace('Sportswear', 'Track')
    .replace('Cheerleader', 'Cheer Squad')
    .replace('Riding', 'Cycling')
    .replace('Kid', 'Small');
}

export function denormalizeName(name: string): string {
  return name
    .trim()
    .replace('Track', 'Sportswear')
    .replace('Cheer Squad', 'Cheerleader')
    .replace('Cycling', 'Riding')
    .replace('Small', 'Kid');
}
