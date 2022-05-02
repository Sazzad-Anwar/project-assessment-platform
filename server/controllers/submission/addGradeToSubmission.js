/*
* * @Description: Add grade to submission of an assessment
* * @Route: /api/v1/assessments/:id/submission/:submissionId/grade
* * @Method: PUT,
! * @Access: Admin, Mentor
*/
const expressAsyncHandler = require("express-async-handler");
const Submission = require("../../models/submission");
const Assessment = require('../../models/assessment');
const mongoose = require('mongoose');
const gradeInput = require("../../utils/InputValidation/addGrade");

const addGradeToSubmission = expressAsyncHandler(async (req, res) => {

    if (mongoose.isObjectIdOrHexString(req.params.id) && mongoose.isObjectIdOrHexString(req.params.submissionId)) {

        const { mark, remark } = await gradeInput.validateAsync(req.body);

        const assessment = await Assessment.findById(req.params.id);
        const submission = await Submission.findById(req.params.submissionId);

        if (assessment && submission) {
            if (req.user.role === 'admin' || (req.user.role === 'mentor' && assessment.mentor._id.toString() === req.user._id.toString())) {

                submission.link = submission.link;
                submission.submittedAt = submission.submittedAt;
                submission.grade.mark = mark ?? submission.grade.mark;
                submission.grade.remark = remark ?? submission.grade.remark;

                await submission.save();

                res.status(200).json({
                    status: "success",
                    data: submission
                })

            } else {
                res.status(403);
                throw new Error("You don't have permission to access this resource");
            }
        } else {
            res.status(404);
            throw new Error("Assessment or submission not found");
        }

    }
});

module.exports = addGradeToSubmission;