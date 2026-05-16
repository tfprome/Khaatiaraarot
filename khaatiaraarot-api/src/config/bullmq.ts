import Redis from 'ioredis';
import { config } from './index';

// BullMQ requires maxRetriesPerRequest: null for blocking operations in workers
export function createBullmqConnection() {
  return new Redis(config.redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
}
