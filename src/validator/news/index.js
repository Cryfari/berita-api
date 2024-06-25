const {
  NewsPayloadSchema,
  EditNewsPalyloadSchema,
  ImageHeadersSchema,
  CategoryParamsSchema,

} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AddNewsValidator = {
  validatePostAddNewsPayload: (payload) => {
    const validationResult = NewsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutNewsPayload: (payload) => {
    const validationResult = EditNewsPalyloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateImageHeaders: (headers) => {
    const validationResult = ImageHeadersSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateCategoryParams: (params) => {
    const validationResult = CategoryParamsSchema.validate(params);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AddNewsValidator;
