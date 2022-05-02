/*
* * @Description: Create assessment
* * @Route: /api/v1/assessment
* * @Method: POST
! * @Access: Admin
*/
const expressAsyncHandler = require("express-async-handler");
const Assessment = require("../../models/assessment");
const assessmentInsert = require("../../utils/InputValidation/createAssessment");
const mongoose = require('mongoose');

const createAssessment = expressAsyncHandler(async (req, res) => {

    /*
    * * @Description: Assessment input validation
    */
    const { title, description, mentor, deadline } = await assessmentInsert.validateAsync(req.body);

    /*
    * * @Description: Check if the mentor id is a valid mongoose id
    */
    if (mongoose.isObjectIdOrHexString(mentor)) {

        /*
        * * @Description: Save the assessment
        */
        const newAssessment = new Assessment({
            title,
            description,
            mentor,
            deadline
        });

        const savedAssessment = await newAssessment.save();

        res.status(201).json({
            status: "success",
            data: savedAssessment
        })
    } else {
        res.status(422);
        throw new Error("Mentor id is invalid");
    }


});


module.exports = createAssessment;