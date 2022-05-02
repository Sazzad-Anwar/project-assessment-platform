/*
* * @Description: Make assessment submission
* * @Route: /api/v1/assessment/:id/submission
* * @Method: POST
! * @Access: Admin, Students
*/

const expressAsyncHandler = require("express-async-handler");
const Assessment = require("../../models/assessment");
const Submission = require("../../models/submission");
const mongoose = require('mongoose');
const assessmentSubmit = require("../../utils/InputValidation/assessmentSubmit");

const submitAssessment = expressAsyncHandler(async (req, res) => {
    /*
    * * @Description: Assessment submission input validation
    */
    const { link } = await assessmentSubmit.validateAsync(req.body);

    if (mongoose.isObjectIdOrHexString(req.params.id)) {

        const assessment = await Assessment.findById(req.params.id);

        if (assessment) {

            if (req.user.role === 'student' || req.user.role === 'admin') {

                let newSubmission = new Submission({
                    link,
                    student: req.user._id,
                })

                const savedSubmission = await newSubmission.save();

                assessment.submission.push(savedSubmission._id);
                await assessment.save();

                res.status(201).json({
                    status: "success",
                    data: savedSubmission
                });

            } else {
                res.status(403);
                throw new Error("You are not authorized to make this submission");
            }

        } else {
            res.status(404);
            throw new Error("Assessment not found");
        }

    } else {
        res.status(400)
        throw new Error("Assessment id is invalid")
    }
});

module.exports = submitAssessment;