const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().max(50).required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('admin', 'user').required(),
});

module.exports = {UserPayloadSchema};
