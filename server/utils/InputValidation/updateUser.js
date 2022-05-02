const joi = require("joi");

/*
 * * Update user input validation
 */

const updateUserInputVariables = joi.object().keys({
  name: joi.string(),
  email: joi.string().email(),
  password: joi.string(),
  confirmPassword: joi.string(),
  phoneNumber: joi.string(),
  role: joi.string().valid("admin", "student", "mentor"),
});

module.exports = updateUserInputVariables;
