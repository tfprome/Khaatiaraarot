import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../config/db';
import { users } from '../db/schema';
import { redis } from '../config/redis';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  getRemainingTtl,
} from '../utils/jwt';
import { AppError } from '../utils/errors';

const BCRYPT_ROUNDS = 12;

type SafeUser = {
  id: string;
  email: string;
  role: 'customer' | 'admin';
  fullName: string;
};

async function issueTokens(user: SafeUser) {
  const payload = { sub: user.id, email: user.email, role: user.role };
  const { token: accessToken } = signAccessToken(payload);
  const { token: refreshToken, jti: refreshJti } = signRefreshToken(payload);

  const ttl = getRemainingTtl(refreshToken);
  await redis.set(`refresh:valid:${refreshJti}`, user.id, 'EX', ttl);

  return { accessToken, refreshToken, user };
}

export async function register(
  email: string,
  password: string,
  fullName: string,
  phone?: string,
) {
  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) throw new AppError(409, 'EMAIL_TAKEN', 'Email already registered');

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const [user] = await db
    .insert(users)
    .values({ email, passwordHash, fullName, phone })
    .returning({
      id: users.id,
      email: users.email,
      role: users.role,
      fullName: users.fullName,
    });

  return issueTokens(user as SafeUser);
}

export async function login(email: string, password: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: {
      id: true,
      email: true,
      role: true,
      fullName: true,
      passwordHash: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');

  return issueTokens({
    id: user.id,
    email: user.email,
    role: user.role as 'customer' | 'admin',
    fullName: user.fullName,
  });
}

export async function refresh(refreshToken: string) {
  let payload: ReturnType<typeof verifyRefreshToken>;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Invalid or expired refresh token');
  }

  const stored = await redis.get(`refresh:valid:${payload.jti}`);
  if (!stored) {
    throw new AppError(401, 'REFRESH_TOKEN_REUSED', 'Refresh token already used or revoked');
  }

  await redis.del(`refresh:valid:${payload.jti}`);

  const user = await db.query.users.findFirst({
    where: eq(users.id, payload.sub),
    columns: { id: true, email: true, role: true, fullName: true, isActive: true },
  });

  if (!user || !user.isActive) {
    throw new AppError(401, 'USER_INACTIVE', 'Account is inactive');
  }

  return issueTokens({
    id: user.id,
    email: user.email,
    role: user.role as 'customer' | 'admin',
    fullName: user.fullName,
  });
}

export async function logout(
  refreshToken: string,
  accessJti?: string,
  accessToken?: string,
) {
  try {
    const payload = verifyRefreshToken(refreshToken);
    await redis.del(`refresh:valid:${payload.jti}`);
  } catch {
    // refresh token invalid or expired — proceed to revoke access token anyway
  }

  if (accessJti && accessToken) {
    const ttl = getRemainingTtl(accessToken);
    if (ttl > 0) {
      await redis.set(`blocklist:${accessJti}`, '1', 'EX', ttl);
    }
  }
}
