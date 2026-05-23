import { redis } from "@/lib/redis";

const PREFIX = "idempotency:";

const TTL_SECONDS = 60 * 15;

type CachedResponse = {
  status: number;
  body: unknown;
};

export async function getIdempotentResponse(
  key: string
): Promise<CachedResponse | null> {
  const response = await redis.get<CachedResponse>(
    `${PREFIX}${key}`
  );

  return response ?? null;
}

export async function cacheIdempotentResponse(
  key: string,
  response: CachedResponse
) {
  await redis.set(
    `${PREFIX}${key}`,
    response,
    {
      ex: TTL_SECONDS,
    }
  );
}
