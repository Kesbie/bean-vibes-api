const Joi = require('joi');
const { password } = require('./custom.validation');

const changePassword = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const updateProfile = {
  body: Joi.object().keys({
    name: Joi.string(),
  }),
};

module.exports = {
  changePassword,
  updateProfile,
};