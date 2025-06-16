import { Router } from 'express';
import authController from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import {
  registerSchema,
  loginSchema,
  resetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(authController.register),
);

router.post(
  '/login',
  validateBody(loginSchema),
  ctrlWrapper(authController.login),
);

router.post('/refresh', ctrlWrapper(authController.refresh));
router.post('/logout', ctrlWrapper(authController.logout));

router.post(
  '/send-reset-email',
  validateBody(resetEmailSchema),
  ctrlWrapper(authController.sendResetEmail),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(authController.resetPassword),
);

export default router;