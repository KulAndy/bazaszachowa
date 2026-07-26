import { CACHE } from "../settings";

const getCache = async (
  cache: Cache,
  request: Request,
): Promise<Response | undefined> => {
  const cached = await cache.match(request);

  if (!cached) {
    return undefined;
  }

  const date = cached.headers.get("x-cache-time");

  if (!date) {
    return cached;
  }

  const age = Date.now() - Number(date);

  if (age > CACHE.ttl) {
    await cache.delete(request);

    return undefined;
  }

  return cached;
};

export default getCache;
