const Joi = require('@hapi/joi');

exports.EventModel = Joi.object({
  name: Joi.string().pattern(new RegExp('[a-zA-Z]+')).max(200)
});
