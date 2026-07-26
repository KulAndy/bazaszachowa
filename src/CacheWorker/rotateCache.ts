import { CACHE } from "../settings";

const rotateCache = async (cache: Cache): Promise<void> => {
  const keys = await cache.keys();

  if (keys.length <= CACHE.limit) {
    return;
  }

  const removeCount = keys.length - CACHE.limit;

  for (let index = 0; index < removeCount; index++) {
    await cache.delete(keys[index]);
  }
};

export default rotateCache;
