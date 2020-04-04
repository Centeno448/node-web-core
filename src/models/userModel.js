const Joi = require('@hapi/joi');

const AddUser = Joi.object({
  username: Joi.string().alphanum().min(4).max(100).required(),

  email: Joi.string().email({ minDomainSegments: 1 }).required(),

  password: Joi.string().required().min(6)
});

const UpdateUser = Joi.object({
  username: Joi.string().alphanum().min(4).max(100).required(),

  email: Joi.string().email({ minDomainSegments: 1 }).required(),

  password: Joi.string().required().min(6)
});

const LoginUser = Joi.object({
  username: Joi.string().alphanum().min(4).max(100).required(),

  password: Joi.string().required().min(6)
});

module.exports = {
  UpdateUser,
  AddUser,
  LoginUser
};
