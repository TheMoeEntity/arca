// apps/backend/src/lib/redis.ts
import Redis from 'ioredis';
import { env } from '@/config/env';

declare global {
  // eslint-disable-next-line no-var
  var __redis: Redis | undefined;
}

export const redis =
  globalThis.__redis ??
  new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: false,
    retryStrategy(times) {
      if (times > 5) {
        console.error('[Arca] Redis connection failed after 5 retries');
        return null; // stop retrying
      }
      return Math.min(times * 200, 2000); // exponential backoff, max 2s
    },
  });

redis.on('connect', () => console.info('[Arca] ✓ Redis connected'));
redis.on('error', (err) => console.error('[Arca] Redis error:', err.message));

if (env.NODE_ENV !== 'production') {
  globalThis.__redis = redis;
}