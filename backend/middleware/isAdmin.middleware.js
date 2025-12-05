import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";

const isAdminMiddleware = AsyncHandler(async (req, res, next) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  if (req.user.role !== "admin") {
    throw new ApiError(403, "Forbidden: Admin access required");
  }

  next();
});

export default isAdminMiddleware;
