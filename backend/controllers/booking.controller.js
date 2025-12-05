import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Booking from "../models/Booking.model.js";

const processPayment = AsyncHandler(async (req, res) => {
  const { userId, propertyId, amount } = req.body;

  if (!userId || !propertyId || !amount) {
    throw new ApiError(400, "All fields are required");
  }

  const booking = await Booking.create({
    userId,
    propertyId,
    amount,
    paymentStatus: "completed", // Simulate success (use Stripe in real app)
  });

  return res
    .status(201)
    .json(new ApiResponse(201, booking, "Booking confirmed successfully!"));
});

export { processPayment };
