import { Router } from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import ApiResponse from "../utils/ApiResponse.js"; // ADDED - was missing

const router = Router();

// Public routes
router.route("/signup").post(signupUser);
router.route("/login").post(loginUser);

// Protected routes
router.route("/logout").post(authMiddleware, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

// Get current user info
router.route("/me").get(authMiddleware, (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          _id: req.user._id,
          username: req.user.username,
          email: req.user.email,
          phone: req.user.phone,
          role: req.user.role,
        },
      },
      "User fetched successfully"
    )
  );
});

export default router;
