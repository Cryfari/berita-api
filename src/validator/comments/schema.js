const Joi = require('joi');

const CommentsPayloadSchema = Joi.object({
  content: Joi.string().required().messages({
    'string.empty': 'content tidak Boleh Kosong.',
  }),
});

module.exports = {CommentsPayloadSchema};
