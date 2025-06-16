import createHttpError from 'http-errors';
import authService from '../services/auth.js';
import jwt from 'jsonwebtoken';
import User from '../db/models/user.js';
import sendMail from '../utils/sendMail.js';
import Session from '../db/models/session.js';

const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await authService.findUserByEmail(email);
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const newUser = await authService.createUser({ name, email, password });

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken } = await authService.loginUser({
    email,
    password,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: { accessToken },
  });
};

const refresh = async (req, res) => {
  const { refreshToken: oldRefreshToken } = req.cookies;
  if (!oldRefreshToken) {
    throw createHttpError(401, 'Refresh token missing');
  }

  const { accessToken, refreshToken } = await authService.refreshSession(
    oldRefreshToken,
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
};

const logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw createHttpError(401, 'Not authenticated');
  }

  await authService.logoutUser(refreshToken);

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(204).send();
};

const sendResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '5m',
  });

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  await sendMail({
    to: email,
    subject: 'Reset Password',
    html: `<p>Click the link below to reset your password:</p>
           <a href="${resetLink}">${resetLink}</a>`,
  });

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    await authService.resetUserPassword(user, password);

    // Видаляємо всі сесії користувача після оновлення пароля
    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (/* eslint-disable-line no-unused-vars */error) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }
};

export default {
  register,
  login,
  refresh,
  logout,
  sendResetEmail,
  resetPassword,
};
