/*
* * @Description: Delete assessment submission
* * @Route: /api/v1/assessment/:id/submission
* * @Method: DELETE
! * @Access: Admin
*/
const expressAsyncHandler = require("express-async-handler");
const Submission = require("../../models/submission");
const Assessment = require("../../models/assessment");
const mongoose = require('mongoose');

const deleteSubmission = expressAsyncHandler(async (req, res) => {

    if (mongoose.isObjectIdOrHexString(req.params.id) && mongoose.isObjectIdOrHexString(req.params.submissionId)) {

        const assessment = await Assessment.findById(req.params.id);

        const submission = await Submission.findByIdAndDelete(req.params.submissionId);

        if (assessment && submission) {

            res.status(200).json({
                status: "success",
                message: `Submission ${submission._id} deleted`
            })

        } else {
            res.status(404);
            throw new Error("Submission not found");
        }
    }
});

module.exports = deleteSubmission;