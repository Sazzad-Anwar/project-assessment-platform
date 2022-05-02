const joi = require("joi");

/*
* * @Description: Query validation
*/

const queryValidation = joi.object().keys({
    page: joi.number().integer().min(1),
    limit: joi.number().integer().min(1),
    q: joi.string(),
});

module.exports = queryValidation;