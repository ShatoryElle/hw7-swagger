import createHttpError from 'http-errors';

const parseNumber = (number, defaultValue, paramName) => {
  const isString = typeof number === 'string';
  if (!isString) return defaultValue;

  const parsedNumber = parseInt(number, 10);
  if (Number.isNaN(parsedNumber) || parsedNumber < 1) {
    throw new createHttpError.BadRequest(
      `Invalid pagination parameter: ${paramName}=${number}`,
    );
  }

  return parsedNumber;
};

const parsePaginationParams = (query) => ({
  page: parseNumber(query.page, 1, 'page'),
  perPage: parseNumber(query.perPage, 10, 'perPage'),
});

export default parsePaginationParams;