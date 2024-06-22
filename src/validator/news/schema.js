const Joi = require('joi');

const NewsPayloadSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'Judul Tidak Boleh Kosong.',
  }),
  body: Joi.string().required(),
  category: Joi.string()
      .valid(
          'Olahraga',
          'Kesehatan',
          'Politik',
          'Teknologi',
          'Fashion',
          'Games',
      ).required().messages({'string.invalid': 'kategori tidak valid.'}),
});

const EditNewsPalyloadSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'Judul Tidak Boleh Kosong.',
  }),
  body: Joi.string().required(),
  category: Joi.string()
      .valid(
          'Olahraga',
          'Kesehatan',
          'Politik',
          'Teknologi',
          'Fashion',
          'Games',
      ).required().messages({'string.invalid': 'kategori tidak valid.'}),
})
module.exports = {NewsPayloadSchema, EditNewsPalyloadSchema};
