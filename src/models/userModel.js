const Joi = require('@hapi/joi');

const AddUser = Joi.object({
  username: Joi.string().alphanum().min(4).max(100).required(),

  email: Joi.string().email({ minDomainSegments: 1 }).required(),

  password: Joi.string().required().min(6),

  role: Joi.string().required().max(10).pattern(new RegExp('[a-zA-Z]+'))
});

const LoginUser = Joi.object({
  username: Joi.string().alphanum().required(),

  password: Joi.string().required()
});

module.exports = {
  AddUser,
  LoginUser
};
