const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().max(50).required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('admin', 'user').required(),
});

const PutNewUserNamePayloadSchema = Joi.object({
  newUsername: Joi.string().max(50).required(),
});
const PutNewEmailPayloadSchema = Joi.object({
  newEmail: Joi.string().email().required(),
});
const PutNewRolePayloadSchema = Joi.object({
  newRole: Joi.string().valid('admin', 'user').required(),
});
module.exports = {
  UserPayloadSchema,
  PutNewUserNamePayloadSchema,
  PutNewEmailPayloadSchema,
  PutNewRolePayloadSchema,
};
