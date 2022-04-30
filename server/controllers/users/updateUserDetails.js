/*
* * @Description: Update a user's details
* * @Route: /api/v1/users/:id
* * @Method: GET
! * @Access: SuperAdmin, Admin
*/
const expressAsyncHandler = require("express-async-handler");
const User = require("../../models/User.js");
const registrationRequestVariables = require("../../utils/InputValidation/registration.js");

const getUserDetailsUpdate = expressAsyncHandler(async (req, res) => {
  let { id } = req.params;

  /*
   * * @Description: Registration input validation
   */
  let { name, email, phoneNumber, isActive, role } = await registrationRequestVariables.validateAsync(req.body);;

  /*
  * * @Description: Check if user already exists. If exists then update the user details else send the error message.
  */
  const user = await User.findById(id);

  if (user) {
    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.isActive = isActive;
    user.role = role;
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
});

module.exports = getUserDetailsUpdate;
