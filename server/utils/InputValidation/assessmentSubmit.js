const joi = require('joi');

/*
* * Assessment Submission input validation
*/
const assessmentSubmit = joi.object().keys({
    link: joi.string().required(),
})

module.exports = assessmentSubmit;