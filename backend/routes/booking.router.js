import { Router } from "express";
import { processPayment } from "../controllers/booking.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.route("/payment").post(authMiddleware, processPayment);

export default router;
