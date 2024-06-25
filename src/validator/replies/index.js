const {RepliesPayloadSchema} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AddReplyValidator = {
  validatePostAddCReplyPayload: (payload) => {
    const validationResult = RepliesPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AddReplyValidator;
