import { Router } from "express";
import { makeAdmin } from "../controllers/admin.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import isAdminMiddleware from "../middleware/isAdmin.middleware.js";
import ApiResponse from "../utils/ApiResponse.js";

const router = Router();

// Test route - verify admin authentication
router.route("/verify").get(authMiddleware, isAdminMiddleware, (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          _id: req.user._id,
          username: req.user.username,
          email: req.user.email,
          role: req.user.role,
        },
        timestamp: new Date().toISOString(),
      },
      "Admin access verified"
    )
  );
});

// Debug route - check authentication status (remove in production)
router.route("/debug").get(authMiddleware, (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      {
        authenticated: true,
        user: {
          _id: req.user._id,
          username: req.user.username,
          email: req.user.email,
          role: req.user.role,
        },
        isAdmin: req.user.role === "admin",
      },
      "Auth debug info"
    )
  );
});

// Promote user to admin
router.route("/make-admin").post(authMiddleware, isAdminMiddleware, makeAdmin);

export default router;
