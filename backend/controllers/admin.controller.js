import AsyncHandler from "../utils/AsyncHandler.js";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const makeAdmin = AsyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  if (user.role === "admin") {
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User is already an admin"));
  }

  // Only update role, don't touch password
  user.role = "admin";
  await user.save({ validateBeforeSave: false });

  // Return user without sensitive data
  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User promoted to admin"));
});