function mapToObject<K extends string | number | symbol, V = any>(
  map: Map<K, V>,
): Record<K, V> {
  const obj = {} as Record<K, V>;

  for (const [key, value] of map) {
    obj[key] = value;
  }

  return obj;
}

export default mapToObject;
