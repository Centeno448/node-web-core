const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));

exports.BookExchangeModel = Joi.object({
  fromUser: Joi.number().integer().required(),

  toUser: Joi.number().integer().required(),

  fromBook: Joi.number().integer().required(),

  toBook: Joi.number().integer().required(),

  exchangeDate: Joi.date().format('YYYY-MM-DD').required(),

  failed: Joi.boolean()
});
