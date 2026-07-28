const findCacheValue = async <T>(
  cache: Cache,
  callbackFunction: (x: T) => boolean,
): Promise<T | undefined> => {
  const requests = await cache.keys();

  for (const request of requests) {
    const response = await cache.match(request);

    if (!response) {
      continue;
    }

    try {
      const value = (await response.clone().json()) as T;

      if (callbackFunction(value)) {
        return value;
      }
    } catch {}
  }

  return undefined;
};
export default findCacheValue;
