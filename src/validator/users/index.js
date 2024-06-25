const {
  UserPayloadSchema,
  PutNewUserNamePayloadSchema,
  PutNewEmailPayloadSchema,
  PutNewRolePayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateNewUserRolePayload: (payload) => {
    const validationResult = PutNewRolePayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateNewUserNamePayload: (payload) => {
    const validationResult = PutNewUserNamePayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateNewUserEmailPayload: (payload) => {
    const validationResult = PutNewEmailPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UsersValidator;
