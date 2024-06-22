const {NewsPayloadSchema, EditNewsPalyloadSchema} = require('./schema');
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
  }
};

module.exports = AddNewsValidator;
