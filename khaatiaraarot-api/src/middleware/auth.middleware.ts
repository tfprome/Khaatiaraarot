import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyAccessToken } from '../utils/jwt';
import { redis } from '../config/redis';

export async function authenticateOptional(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next();
  try {
    const payload = verifyAccessToken(token);
    const blocked = await redis.get(`blocklist:${payload.jti}`);
    if (!blocked) {
      req.user = { id: payload.sub, email: payload.email, role: payload.role, jti: payload.jti };
    }
  } catch {
    // invalid token → treat as guest
  }
  next();
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    });
    return;
  }

  let payload: ReturnType<typeof verifyAccessToken>;
  try {
    payload = verifyAccessToken(token);
  } catch {
    res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
    });
    return;
  }

  const blocked = await redis.get(`blocklist:${payload.jti}`);
  if (blocked) {
    res.status(401).json({
      success: false,
      error: { code: 'TOKEN_REVOKED', message: 'Token has been revoked' },
    });
    return;
  }

  req.user = {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
    jti: payload.jti,
  };

  next();
}
