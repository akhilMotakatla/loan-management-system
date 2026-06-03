import Redis from 'ioredis';

let redis;

try {
  redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  });
  redis.on('error', (err) => console.warn('Redis unavailable:', err.message));
} catch {
  redis = null;
}

export default redis;
