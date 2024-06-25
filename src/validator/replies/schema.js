const Joi = require('joi');

const RepliesPayloadSchema = Joi.object({
  content: Joi.string().required().messages({
    'string.empty': 'content tidak Boleh Kosong.',
  }),
});

module.exports = {RepliesPayloadSchema};
