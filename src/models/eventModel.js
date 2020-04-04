const Joi = require('@hapi/joi');

exports.EventModel = Joi.object({
  name: Joi.string().alphanum().max(200).required(),

  startDate: Joi.date().required().less(Joi.ref('startDate')),

  endDate: Joi.date().required().greater(Joi.ref('startDate')),

  eventTypeId: Joi.number().required().positive()
});
