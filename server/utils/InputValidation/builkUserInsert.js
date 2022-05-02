const joi = require("joi");

/*
 * * Bulk user insert input validation
 */

const bulkUserInsert = joi.object().keys({
  dataAmount: joi.number().required(),
});

module.exports = bulkUserInsert;
