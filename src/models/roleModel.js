const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));

exports.RoleModel = Joi.object({
  name: Joi.string().max(50).required()
});
