import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

const isValidId = (req, _res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    return next(new createHttpError.BadRequest('Invalid contact ID'));
  }

  next();
};

export default isValidId;