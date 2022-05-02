/*
* * @Description: Update assessment
* * @Route: /api/v1/assessment/:id
* * @Method: PUT
! * @Access: Admin
*/
const expressAsyncHandler = require("express-async-handler");
const Assessment = require("../../models/assessment");
const mongoose = require('mongoose');
const updateAssessmentInput = require("../../utils/InputValidation/updateAssessment");

const updateAssessment = expressAsyncHandler(async (req, res) => {

    /*
    * * @Description: Assessment input validation
    */
    const { title, description, mentor, deadline } = await updateAssessmentInput.validateAsync(req.body);

    /*
    * * @Description: Check if the mentor id is a valid mongoose id
    */
    if (mongoose.isObjectIdOrHexString(mentor) && mongoose.isObjectIdOrHexString(req.params.id)) {

        /*
        * * @Description: Check if the assessment exists
        */
        const assessment = await Assessment.findById(req.params.id);

        if (assessment) {
            assessment.title = title ?? assessment.title;
            assessment.description = description ?? assessment.description;
            assessment.mentor = mentor ?? assessment.mentor;
            assessment.deadline = deadline ?? assessment.deadline;

            const savedAssessment = await assessment.save();

            res.status(200).json({
                status: "success",
                data: savedAssessment
            })
        } else {
            res.status(404);
            throw new Error("Assessment not found");
        }

    } else {
        res.status(422);
        throw new Error("Mentor id or assessment id is invalid");
    }


});


module.exports = updateAssessment;