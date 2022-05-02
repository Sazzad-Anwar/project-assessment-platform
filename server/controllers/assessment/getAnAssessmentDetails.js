/*
* * @Description: Get assessment list
* * @Route: /api/v1/assessment/:id
* * @Method: GET
! * @Access: Admin, Mentor
*/
const expressAsyncHandler = require("express-async-handler");
const Assessment = require("../../models/assessment");
const Submission = require("../../models/submission");
const mongoose = require('mongoose');

const getAnAssessmentDetails = expressAsyncHandler(async (req, res) => {

    /*
    * * @Description: Get all assessments as admin
    */
    if (mongoose.isObjectIdOrHexString(req.params.id)) {

        if (req.user.role === 'admin' || req.user.role === 'mentor') {

            const assessment = await Assessment.findById(req.params.id).populate([{ path: 'mentor', select: 'name email phoneNumber' }, { path: 'submission', populate: { path: 'student', select: 'name email phoneNumber' }, select: '_id link student submittedAt grade' }]).sort({ createdAt: -1 }).lean();

            if (assessment) {

                res.status(200).json({
                    status: "success",
                    data: assessment,
                });

            } else {

                res.status(404);
                throw new Error("Assessment not found");
            }
        }

        /*
        * * @Description: Get a particular assessment as student
        */
        else if (req.user.role === 'student') {

            /*
            * * @Description: Get the logged in student's submission for a particular assessment
            */
            let submittedItem = await Submission.findOne({ student: req.user._id });

            if (submittedItem) {

                const assessment = await await Assessment.findById(req.params.id).populate([{ path: 'mentor', select: 'name email phoneNumber' }, { path: 'submission', match: { _id: { $eq: submittedItem._id } }, populate: { path: 'student', select: 'name email phoneNumber' }, select: '_id link student submittedAt grade' }]).sort({ createdAt: -1 }).lean();

                res.status(200).json({
                    status: "success",
                    data: assessment,
                });
            } else {

                const assessments = await Assessment.find().populate([{ path: 'mentor', select: 'name email phoneNumber' }]).sort({ createdAt: -1 }).select(' -submission')
                    .limit(limit ? parseInt(limit) : 20)
                    .skip(
                        page ? (parseInt(page) < 0 ? 1 : parseInt(page) - 1) * parseInt(limit) : 0
                    )
                    .lean();

                res.status(200).json({
                    status: "success",
                    data: assessments,
                });
            }
        }

        /*
        * * @Description: Send error if user is neither admin nor mentor
        */
        else {
            res.status(403);
            throw new Error("You are not allowed to view the resource");
        }

    } else {
        res.status(400);
        throw new Error("Assessment id is invalid");
    }

});


module.exports = getAnAssessmentDetails;