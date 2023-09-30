function mapToObject(map) {
  const obj = {};

  for (const [key, value] of map) {
    obj[key] = value;
  }

  return obj;
}

module.exports = mapToObject;
