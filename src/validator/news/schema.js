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
          'Bencana',
      ).required().messages({'string.invalid': 'kategori tidak valid.'}),
  image: Joi.any(),
});

const EditNewsPalyloadSchema = Joi.object({
  image: Joi.any(),
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
          'Bencana',
      ).required().messages({'any.only': 'kategori tidak valid.'}),
});

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string().valid(
      'image/apng', 'image/avif', 'image/gif',
      'image/jpeg', 'image/png', 'image/webp',
  ).required(),
}).unknown();

const CategoryParamsSchema = Joi.object({
  category: Joi.string()
      .valid(
          'Olahraga',
          'Kesehatan',
          'Politik',
          'Teknologi',
          'Fashion',
          'Games',
          'Bencana',
      ).required().messages({'any.only': 'kategori tidak valid.'}),
});
module.exports = {
  NewsPayloadSchema,
  EditNewsPalyloadSchema,
  ImageHeadersSchema,
  CategoryParamsSchema,
};
