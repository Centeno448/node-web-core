const Joi = require('@hapi/joi');

exports.EventModel = Joi.object({
  name: Joi.string().max(200).required(),

  startAt: Joi.date().required().less(Joi.ref('endAt')),

  endAt: Joi.date().required(),

  eventTypeId: Joi.number().required().positive()
});
