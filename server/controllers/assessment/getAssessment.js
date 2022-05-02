/*
* * @Description: Get assessment list
* * @Route: /api/v1/assessment
* * @Method: GET
! * @Access: Admin, Mentor
*/
const expressAsyncHandler = require("express-async-handler");
const Assessment = require("../../models/assessment");
const Submission = require("../../models/submission");
const queryValidation = require("../../utils/InputValidation/query");

const getAssessment = expressAsyncHandler(async (req, res) => {

    let { limit, page } = await queryValidation.validateAsync(req.query);

    /*
    * * @Description: Get all assessments as admin
    */
    if (req.user.role === 'admin' || req.user.role === 'mentor') {

        const assessments = await Assessment.find().populate([{ path: 'mentor', select: 'name email phoneNumber' }, { path: 'submission', populate: { path: 'student', select: 'name email phoneNumber' }, select: '_id link student submittedAt grade' }]).sort({ createdAt: -1 })
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

    /*
     * * @Description: Get a particular assessment as student
     */
    else if (req.user.role === 'student') {

        /*
        * * @Description: Get the logged in student's submission for a particular assessment
        */
        let submittedItem = await Submission.findOne({ student: req.user._id });

        if (submittedItem) {

            const assessments = await Assessment.find().populate([{ path: 'mentor', select: 'name email phoneNumber' }, { path: 'submission', match: { _id: { $eq: submittedItem._id } }, populate: { path: 'student', select: 'name email phoneNumber' }, select: '_id link student submittedAt grade' }]).sort({ createdAt: -1 })
                .limit(limit ? parseInt(limit) : 20)
                .skip(
                    page ? (parseInt(page) < 0 ? 1 : parseInt(page) - 1) * parseInt(limit) : 0
                )
                .lean();

            res.status(200).json({
                status: "success",
                data: assessments,
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

});


module.exports = getAssessment;