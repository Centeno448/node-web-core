const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));

exports.BookModel = Joi.object({
  name: Joi.string().max(200).required(),

  author: Joi.string().max(50).required(),

  publicationDate: Joi.date().format('YYYY-MM-DD').required(),

  category: Joi.number().integer().required(),

  user: Joi.number().integer().required()
});

exports.BookUpdateModel = Joi.object({
  name: Joi.string().max(200).required(),

  author: Joi.string().max(50).required(),

  publicationDate: Joi.date().format('YYYY-MM-DD').required(),

  category: Joi.number().integer().required(),

  user: Joi.number().integer().required()
});
