import AsyncHandler from "../utils/AsyncHandler.js";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const makeAdmin = AsyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  if (user.role === "admin") {
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User is already admin"));
  }

  user.role = "admin";
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User promoted to admin"));
});

export { makeAdmin };
