/*
* * @Description: Update a user's details
* * @Route: /api/v1/users/:id
* * @Method: GET
! * @Access: SuperAdmin, Admin
*/
const expressAsyncHandler = require("express-async-handler");
const User = require("../../models/User.js");
const updateUserInputVariables = require("../../utils/InputValidation/updateUser.js");

const getUserDetailsUpdate = expressAsyncHandler(async (req, res) => {
  let { id } = req.params;

  /*
   * * @Description: Registration input validation
   */
  let { name, email, phoneNumber, role } =
    await updateUserInputVariables.validateAsync(req.body);

  /*
   * * @Description: Check if user already exists. If exists then update the user details else send the error message.
   */
  const user = await User.findById(id);

  /*
   * * @Description: If the user is not admin but trying to change the role then send the error message.
   */
  if (req.user.role !== "admin" && role && role !== "") {
    res.status(403);
    throw new Error("You are not allowed to update the role");
  } else {
    if (user) {
      user.name = name ?? user.name;
      user.email = email ?? user.email;
      user.phoneNumber = phoneNumber ?? user.phoneNumber;
      user.role = role ?? user.role;
      user.save();

      res.status(200).json({
        status: "success",
        data: user,
      });
    } else {
      res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }
  }
});

module.exports = getUserDetailsUpdate;
