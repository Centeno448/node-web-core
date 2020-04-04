const Joi = require('@hapi/joi');

exports.EventTypeModel = Joi.object({
  name: Joi.string().pattern(new RegExp('[a-zA-Z]+')).max(200)
});
