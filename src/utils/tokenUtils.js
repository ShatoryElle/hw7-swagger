import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/time.js';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret';

/**
 * Генерує JWT access токен і дату його закінчення
 * @param {string} userId
 * @returns {{ accessToken: string, expiresAt: Date }}
 */
export function generateAccessToken(userId) {
  const expiresInMs = FIFTEEN_MINUTES; // 15 хвилин у мілісекундах
  const expiresInStr = '15m';

  const payload = { id: userId };

  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: expiresInStr,
  });

  const expiresAt = new Date(Date.now() + expiresInMs);

  return { accessToken, expiresAt };
}

/**
 * Генерує refresh токен і дату його закінчення
 * @returns {{ refreshToken: string, expiresAt: Date }}
 */
export function generateRefreshToken() {
  const refreshToken = randomBytes(30).toString('base64');
  const expiresAt = new Date(Date.now() + THIRTY_DAYS); // 30 днів
  return { refreshToken, expiresAt };
}
