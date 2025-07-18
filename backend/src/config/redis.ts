import { createClient, RedisClientType } from 'redis';
import { logger } from '@/utils/logger';
import { environment } from './environment';

let redisClient: RedisClientType;

export async function connectRedis(): Promise<void> {
  try {
    const env = environment;
    
    redisClient = createClient({
      url: env.REDIS_URL,
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('✅ Connected to Redis');
    });

    redisClient.on('disconnect', () => {
      logger.warn('❌ Disconnected from Redis');
    });

    await redisClient.connect();
  } catch (error) {
    logger.error('❌ Failed to connect to Redis:', error);
    throw error;
  }
}

export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return redisClient;
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.disconnect();
      logger.info('✅ Disconnected from Redis');
    } catch (error) {
      logger.error('❌ Failed to disconnect from Redis:', error);
    }
  }
} 