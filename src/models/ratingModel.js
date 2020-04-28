const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));

exports.RatingModel = Joi.object({
  score: Joi.number().precision(1).min(1).max(5).required(),

  comment: Joi.string().max(200),

  toUser: Joi.number().integer().required(),

  fromUser: Joi.number().integer().required()
});

exports.RatingUpdateModel = Joi.object({
  score: Joi.number().precision(1).min(1).max(5).required(),

  comment: Joi.string().max(200)
});
