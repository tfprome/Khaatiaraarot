import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redis } from '../config/redis';

function makeStore(prefix: string) {
  return new RedisStore({
    prefix,
    sendCommand: (command: string, ...args: string[]) => redis.call(command, ...args) as Promise<number>,
  });
}

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: makeStore('rl:general:'),
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many requests, try again later.' },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: makeStore('rl:auth:'),
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many auth attempts, try again later.' },
});

export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  store: makeStore('rl:upload:'),
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many uploads, try again later.' },
});
