const joi = require("joi");

/*
 * * Registration input validation
 */

const registrationRequestVariables = joi.object().keys({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  confirmPassword: joi.string().required(),
  phoneNumber: joi.string().required(),
  role: joi.string().valid("admin", "student", "mentor"),
});

module.exports = registrationRequestVariables;
