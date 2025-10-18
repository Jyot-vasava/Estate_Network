import nodemailer from "nodemailer";
import { asyncHandler } from "../utils/AsyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Booking } from "../models/Booking.model.js";

const processPayment = asyncHandler(async (req, res) => {
  const {
    userId,
    propertyId,
    name,
    email,
    accountNumber,
    expiryDate,
    ccv,
    amount,
  } = req.body;

  // Validate required fields
  if (
    !userId ||
    !propertyId ||
    !name ||
    !email ||
    !accountNumber ||
    !expiryDate ||
    !ccv ||
    !amount
  ) {
    throw new ApiError(400, "All payment fields are required");
  }

  // WARNING: Storing credit card data is PCI-DSS non-compliant
  // This should NEVER be done in production
  // Use a payment gateway like Stripe, PayPal, or Razorpay instead

  // Create booking record
  const booking = await Booking.create({
    userId,
    propertyId,
    name,
    email,
    accountNumber,
    expiryDate,
    ccv,
    amount,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Payment processed successfully"));
});

const sendConfirmationEmail = asyncHandler(async (req, res) => {
  const { email, bookingDetails } = req.body;

  if (!email || !bookingDetails) {
    throw new ApiError(400, "Email and booking details are required");
  }

  // Configure the email transport using Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Booking Confirmation",
    text: `Your booking was successful!\n\nDetails:\n${bookingDetails}`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Confirmation email sent successfully"));
});

export { processPayment, sendConfirmationEmail };
