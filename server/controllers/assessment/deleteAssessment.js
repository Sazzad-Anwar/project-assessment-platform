/*
* * @Description: Delete an assessment
* * @Route: /api/v1/assessment/:id
* * @Method: DELETE
! * @Access: Admin
*/
const expressAsyncHandler = require("express-async-handler");
const Assessment = require("../../models/assessment");
const mongoose = require('mongoose');

const deleteAssessment = expressAsyncHandler(async (req, res) => {

    /*
    * * @Description: Check if the mentor id is a valid mongoose id
    */
    if (mongoose.isObjectIdOrHexString(req.params.id)) {

        /*
        * * @Description: Check if the assessment exists
        */
        const assessment = await Assessment.findByIdAndDelete(req.params.id);

        if (assessment) {
            res.status(200).json({
                status: "success",
                data: `Assessment ${assessment.title} deleted`
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


module.exports = deleteAssessment;