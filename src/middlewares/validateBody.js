import createHttpError from 'http-errors';

const validateBody = (schema) => (req, _res, next) => {
  return schema
    .validateAsync(req.body, { abortEarly: false })
    .then(() => next())
    .catch((error) => {
      const errors = error.details.map((detail) => detail.message).join(', ');
      next(new createHttpError.BadRequest(errors));
    });
};

export default validateBody;