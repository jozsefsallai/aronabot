function generateKey(name) {
  return name
    .toLowerCase()
    .replace(/\s/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

function normalizeName(name) {
  return name
    .trim()
    .replace('Sportswear', 'Track')
    .replace('Cheerleader', 'Cheer Squad')
    .replace('Riding', 'Cycling')
    .replace('Kid', 'Small');
}

function denormalizeName(name) {
  return name
    .trim()
    .replace('Track', 'Sportswear')
    .replace('Cheer Squad', 'Cheerleader')
    .replace('Cycling', 'Riding')
    .replace('Small', 'Kid');
}

module.exports = {
  generateKey,
  normalizeName,
  denormalizeName,
};
