import { prisma } from "@/lib/db";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
};

/**
 * Persistent rate limiting via Prisma RateLimitBucket.
 * Falls back to in-memory Map if the database is unavailable.
 */
const memoryBuckets = new Map<string, { count: number; windowStart: number }>();

export async function checkRateLimit(
  key: string,
  limit = 5,
  windowMs = 15 * 60 * 1000,
): Promise<RateLimitResult> {
  const now = Date.now();
  const id = `rl:${key}`;

  try {
    const existing = await prisma.rateLimitBucket.findUnique({ where: { id } });

    if (!existing || now - existing.windowStart.getTime() >= windowMs) {
      await prisma.rateLimitBucket.upsert({
        where: { id },
        create: { id, count: 1, windowStart: new Date(now) },
        update: { count: 1, windowStart: new Date(now) },
      });
      return { allowed: true, remaining: limit - 1 };
    }

    if (existing.count >= limit) {
      const retryAfterSeconds = Math.ceil(
        (windowMs - (now - existing.windowStart.getTime())) / 1000,
      );
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }

    await prisma.rateLimitBucket.update({
      where: { id },
      data: { count: { increment: 1 } },
    });
    return { allowed: true, remaining: limit - existing.count - 1 };
  } catch {
    // Fallback: in-memory (single-instance only)
    const bucket = memoryBuckets.get(id);
    if (!bucket || now - bucket.windowStart >= windowMs) {
      memoryBuckets.set(id, { count: 1, windowStart: now });
      return { allowed: true, remaining: limit - 1 };
    }
    if (bucket.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.ceil((windowMs - (now - bucket.windowStart)) / 1000),
      };
    }
    bucket.count += 1;
    return { allowed: true, remaining: limit - bucket.count };
  }
}
