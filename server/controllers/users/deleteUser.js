/*
* * @Description: Get a user's details
* * @Route: /api/v1/users/:id
* * @Method: DELETE
! * @Access: SuperAdmin, Admin
*/
const expressAsyncHandler = require("express-async-handler");
const User = require("../../models/User.js");
const mongoose = require("mongoose");

const deleteUser = expressAsyncHandler(async (req, res) => {
  let { id } = req.params;

  if (mongoose.isObjectIdOrHexString(id)) {
    let user = await User.findByIdAndDelete({ _id: id });

    if (user) {
      res.status(200).json({
        status: "success",
        data: `User ${id} is deleted successfully`,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } else {
    res.status(400);
    throw new Error("User id is invalid");
  }
});

module.exports = deleteUser;
