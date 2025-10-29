import { asyncHandler } from "../utils/AsyncHandler.js";
import {ApiError} from "../utils/ApiError.js";

const isAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized - Please login first");
  }

  if (req.user.role !== "admin") {
    throw new ApiError(403, "Access denied - Admin only");
  }

  next();
});

export  {isAdmin};
