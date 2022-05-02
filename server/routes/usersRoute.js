/*
 * This file contains all routes for a users
 */
const { AccessTokenValidation } = require("auth-middleware-jwt");
const { Router } = require("express");
const bulkUsersInsert = require("../controllers/users/bulkUsersInsert");
const deleteUser = require("../controllers/users/deleteUser");
const getUserDetails = require("../controllers/users/getUserDetails");
const getAllUsersController = require("../controllers/users/getUsersController");
const getUserDetailsUpdate = require("../controllers/users/updateUserDetails");
const checkUser = require("../middlewares/checkUser");
const router = Router();

/*
* * @Description: Get all users
* * @Route: /api/v1/users
* * @Method: GET
! * @Access: Admin
*/
router
  .route("/")
  .get(AccessTokenValidation, checkUser(["admin"]), getAllUsersController);

/*
* * @Description: Bulk insert Users
* * @Route: /api/v1/users
* * @Method: POST
! * @Access: Admin
*/
router
  .route("/bulkInsert")
  .post(AccessTokenValidation, checkUser(["admin"]), bulkUsersInsert);

/*
* * @Description: Get a user's details
* * @Route: /api/v1/users/:id
* * @Method: GET, PUT, DELETE
! * @Access: Admin, Students, Mentors
*/
router
  .route("/:id")
  .get(
    AccessTokenValidation,
    checkUser(["admin", "student", "mentor"]),
    getUserDetails
  )
  .put(
    AccessTokenValidation,
    checkUser(["admin", "user", "mentor"]),
    getUserDetailsUpdate
  )
  .delete(AccessTokenValidation, checkUser(["admin"]), deleteUser);

module.exports = router;
