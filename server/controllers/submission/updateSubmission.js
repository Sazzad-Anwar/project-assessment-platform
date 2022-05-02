/*
* * @Description: Make assessment submission
* * @Route: /api/v1/assessment/:id/submission
* * @Method: PUT
! * @Access: Admin
*/
const expressAsyncHandler = require("express-async-handler");
const Submission = require("../../models/submission");
const Assessment = require("../../models/assessment");
const mongoose = require('mongoose');
const assessmentSubmit = require("../../utils/InputValidation/assessmentSubmit");

const updateSubmission = expressAsyncHandler(async (req, res) => {

    if (mongoose.isObjectIdOrHexString(req.params.id) && mongoose.isObjectIdOrHexString(req.params.submissionId)) {

        const { link } = await assessmentSubmit.validateAsync(req.body);
        const assessment = await Assessment.findById(req.params.id);
        const submission = await Submission.findById(req.params.submissionId);

        if (assessment && submission) {

            submission.link = link ?? submission.link;
            submission.submittedAt = Date.now();
            await submission.save();

            res.status(200).json({
                status: "success",
                data: submission
            })

        } else {
            res.status(404);
            throw new Error("Submission not found");
        }
    } else {
        res.status(400);
        throw new Error("Invalid submission/assessment id");
    }
});

module.exports = updateSubmission;