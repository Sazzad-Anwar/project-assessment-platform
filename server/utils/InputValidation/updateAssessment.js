const joi = require("joi");

/*
* * Assessment create input validation
*/
const updateAssessmentInput = joi.object().keys({
    title: joi.string(),
    description: joi.string(),
    mentor: joi.string(),
    deadline: joi.date(),
    submission: joi.array().items(joi.string()),
});


module.exports = updateAssessmentInput;