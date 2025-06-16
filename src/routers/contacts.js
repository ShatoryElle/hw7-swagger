import { Router } from 'express';
import contactController from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/multer.js';
import * as validation from '../validation/contacts.js';

const router = Router();

router.get('/', authenticate, ctrlWrapper(contactController.getContacts));
router.get(
  '/:contactId',
  authenticate,
  isValidId,
  ctrlWrapper(contactController.getContactById),
);

router.post(
  '/',
  authenticate,
  upload.single('photo'),
  validateBody(validation.contactSchema),
  ctrlWrapper(contactController.createContact),
);

router.patch(
  '/:contactId',
  authenticate,
  isValidId,
  upload.single('photo'),
  validateBody(validation.updateContactSchema),
  ctrlWrapper(contactController.patchContact),
);

router.delete(
  '/:contactId',
  authenticate,
  isValidId,
  ctrlWrapper(contactController.deleteContact),
);

export default router;