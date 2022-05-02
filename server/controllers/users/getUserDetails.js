/*
* * @Description: Get a user's details
* * @Route: /api/v1/users/:id
* * @Method: GET
! * @Access: SuperAdmin, Admin
*/
const expressAsyncHandler = require("express-async-handler");
const User = require("../../models/User.js");
const mongoose = require("mongoose");

const getUserDetails = expressAsyncHandler(async (req, res) => {
  let { id } = req.params;

  if (mongoose.isObjectIdOrHexString(id)) {
    const user = await User.findById(id)
      .select("-password -refreshToken")
      .lean();

    if (
      req.user._id.toString() === user._id.toString() ||
      req.user.role === "admin"
    ) {
      res.status(200).json({
        status: "success",
        data: user,
      });
    } else {
      res.status(403);
      throw new Error("You are not allowed to view this user details");
    }
  } else if (!mongoose.isObjectIdOrHexString(id)) {
    res.status(400);
    throw new Error("User id is invalid");
  }
});

module.exports = getUserDetails;
