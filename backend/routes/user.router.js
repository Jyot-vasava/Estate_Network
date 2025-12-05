import { Router } from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.route("/signup").post(signupUser);
router.route("/login").post(loginUser);
router.route("/logout").post(authMiddleware, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/me").get(authMiddleware, (req, res) => {
  res.status(200).json(new ApiResponse(200, { user: req.user }, "User fetched"));
});

export default router;
