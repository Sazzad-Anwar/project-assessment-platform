/*
 * This file contains all routes for assessments
 */
const { AccessTokenValidation } = require('auth-middleware-jwt');
const createAssessment = require('../controllers/assessment/createAssessment');
const deleteAssessment = require('../controllers/assessment/deleteAssessment');
const getAnAssessmentDetails = require('../controllers/assessment/getAnAssessmentDetails');
const getAssessment = require('../controllers/assessment/getAssessment');
const updateAssessment = require('../controllers/assessment/updateAssessment');
const addGradeToSubmission = require('../controllers/submission/addGradeToSubmission');
const deleteSubmission = require('../controllers/submission/deleteSubmission');
const submitAssessment = require('../controllers/submission/submitAssessment');
const updateSubmission = require('../controllers/submission/updateSubmission');
const checkUser = require('../middlewares/checkUser');
const router = require('express').Router();


/*
* * @Description: Create assessment
* * @Route: /api/v1/assessments
* * @Method: POST
! * @Access: Admin
*/
router
    .route('/')
    .get(AccessTokenValidation, getAssessment)
    .post(AccessTokenValidation, checkUser(['admin']), createAssessment)


/*
* * @Description: Update, Delete, get a particular details of assessment
* * @Route: /api/v1/assessments/:id
* * @Method: PUT, DELETE, GET
! * @Access: Admin
*/
router
    .route('/:id')
    .get(AccessTokenValidation, getAnAssessmentDetails)
    .put(AccessTokenValidation, checkUser(['admin']), updateAssessment)
    .delete(AccessTokenValidation, checkUser(['admin']), deleteAssessment);


/*
* * @Description: Submit an assessment's submission
* * @Route: /api/v1/assessments/:id/submission
* * @Method: POST
! * @Access: Admin, Students
*/
router
    .route('/:id/submission')
    .post(AccessTokenValidation, checkUser(['admin', 'student']), submitAssessment)

/*
* * @Description: Submit an assessment's submission
* * @Route: /api/v1/assessments/:id/submission
* * @Method: PUT, DELETE
! * @Access: Admin
*/
router
    .route('/:id/submission/:submissionId')
    .put(AccessTokenValidation, checkUser(['admin']), updateSubmission)
    .delete(AccessTokenValidation, checkUser(['admin']), deleteSubmission);

/*
* * @Description: Add grade to submission of an assessment
* * @Route: /api/v1/assessments/:id/submission/:submissionId/grade
* * @Method: PUT,
! * @Access: Admin, Mentor
*/
router
    .route('/:id/submission/:submissionId/grade')
    .put(AccessTokenValidation, checkUser(['admin', 'mentor']), addGradeToSubmission);


module.exports = router;