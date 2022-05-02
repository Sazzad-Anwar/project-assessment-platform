const joi = require('joi');


/*
* * Assessment Submission grade input validation
*/
const gradeInput = joi.object().keys({
    mark: joi.number().required(),
    remark: joi.string().required(),
});

module.exports = gradeInput;