const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));

exports.BookCategoryModel = Joi.object({
  name: Joi.string().max(50).required(),

  description: Joi.string().max(200)
});
