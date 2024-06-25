const {CommentsPayloadSchema} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AddCommentValidator = {
  validatePostAddCommentPayload: (payload) => {
    const validationResult = CommentsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AddCommentValidator;
