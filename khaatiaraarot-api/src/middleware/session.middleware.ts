import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';

const SESSION_COOKIE = 'kha_session';

export function ensureSession(req: Request, res: Response, next: NextFunction) {
  let sessionId = req.cookies?.[SESSION_COOKIE] as string | undefined;
  if (!sessionId) {
    sessionId = randomUUID();
    res.cookie(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }
  req.sessionId = sessionId;
  next();
}

export { SESSION_COOKIE };
