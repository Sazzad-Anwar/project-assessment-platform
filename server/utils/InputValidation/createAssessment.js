const joi = require("joi");

/*
* * Assessment create input validation
*/
const assessmentInsert = joi.object().keys({
    title: joi.string().required(),
    description: joi.string().required(),
    mentor: joi.string().required(),
    deadline: joi.date().required(),
    submission: joi.array().items(joi.string()),
});


module.exports = assessmentInsert;