import rotateCache from "./rotateCache";

const putCache = async (
  cache: Cache,
  request: Request,
  response: Response,
): Promise<void> => {
  if (!response.ok) {
    return;
  }

  const headers = new Headers(response.headers);

  headers.set("x-cache-time", Date.now().toString());

  const cachedResponse = new Response(await response.clone().blob(), {
    headers,
    status: response.status,
    statusText: response.statusText,
  });

  await cache.put(request, cachedResponse);
  await rotateCache(cache);
};

export default putCache;
