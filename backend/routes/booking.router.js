import express from "express"
import {
  processPayment,
  sendConfirmationEmail,
} from "../controllers/booking.controller.js"

const router = express.Router();

router.route('/payment').post(processPayment)
router.route("/confirmation-email").post(sendConfirmationEmail)

export default router