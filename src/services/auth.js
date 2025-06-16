import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import User from '../db/models/user.js';
import Session from '../db/models/session.js';

const ACCESS_TOKEN_EXPIRATION = 15 * 60 * 1000;
const REFRESH_TOKEN_EXPIRATION = 30 * 24 * 60 * 60 * 1000;
const TOKEN_LENGTH = 30;

const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

const createUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return User.create({ name, email, password: hashedPassword });
};

const generateTokens = () => ({
  accessToken: randomBytes(TOKEN_LENGTH).toString('base64'),
  refreshToken: randomBytes(TOKEN_LENGTH).toString('base64'),
});

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createHttpError(401, 'Invalid email or password');
  }

  await Session.deleteOne({ userId: user._id });

  const { accessToken, refreshToken } = generateTokens();

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_EXPIRATION),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION),
  });

  return { accessToken, refreshToken };
};

const refreshSession = async (oldRefreshToken) => {
  const session = await Session.findOne({ refreshToken: oldRefreshToken });
  if (!session || new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(403, 'Invalid or expired refresh token');
  }

  await Session.deleteOne({ _id: session._id });

  const { accessToken, refreshToken } = generateTokens();

  await Session.create({
    userId: session.userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_EXPIRATION),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION),
  });

  return { accessToken, refreshToken };
};

const logoutUser = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(403, 'Invalid refresh token');
  }

  await Session.deleteOne({ _id: session._id });
};

const resetUserPassword = async (user, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
};

export default {
  findUserByEmail,
  createUser,
  loginUser,
  refreshSession,
  logoutUser,
  resetUserPassword,
};