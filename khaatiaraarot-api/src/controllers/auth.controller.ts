import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as authService from '../services/auth.service';
import { mergeGuestCart } from '../services/cart.service';
import { SESSION_COOKIE } from '../middleware/session.middleware';
import { db } from '../config/db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

const REFRESH_COOKIE = 'kha_refresh';

function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/api/v1/auth',
  };
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, fullName, phone } = req.body;
    const { accessToken, refreshToken, user } = await authService.register(
      email,
      password,
      fullName,
      phone,
    );
    res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions());
    res.status(201).json({
      success: true,
      data: {
        accessToken,
        user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await authService.login(email, password);

    const sessionId = req.cookies?.[SESSION_COOKIE] as string | undefined;
    if (sessionId) {
      await mergeGuestCart(sessionId, user.id).catch(() => {});
      res.clearCookie(SESSION_COOKIE, { path: '/' });
    }

    res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions());
    res.status(200).json({
      success: true,
      data: {
        accessToken,
        user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) {
      res.status(401).json({
        success: false,
        error: { code: 'NO_REFRESH_TOKEN', message: 'No refresh token provided' },
      });
      return;
    }
    const { accessToken, refreshToken: newRefresh, user } = await authService.refresh(token);
    res.cookie(REFRESH_COOKIE, newRefresh, refreshCookieOptions());
    res.status(200).json({
      success: true,
      data: {
        accessToken,
        user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { id: true, email: true, fullName: true, phone: true, role: true, createdAt: true },
    });
    if (!user) {
      res.status(404).json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
      return;
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE];
    const accessJti = req.user?.jti;
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (refreshToken) {
      await authService.logout(refreshToken, accessJti, accessToken);
    }

    res.clearCookie(REFRESH_COOKIE, { path: '/api/v1/auth' });
    res.status(200).json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
