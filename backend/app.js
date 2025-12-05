// app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ApiError from "./utils/ApiError.js";

import userRouter from "./routes/user.router.js";
import propertyRouter from "./routes/property.router.js";
import bookingRouter from "./routes/booking.router.js";
import contactRouter from "./routes/contact.router.js";
import contactOwnerRouter from "./routes/contactOwner.router.js";
import adminRouter from "./routes/admin.router.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/contacts", contactRouter);
app.use("/api/v1/contact-owner", contactOwnerRouter);
app.use("/api/v1/admin", adminRouter);

// Health
app.get("/", (req, res) => res.json({ success: true, message: "API Running" }));

// 404
app.use("*", (req, res, next) => next(new ApiError(404, "Route not found")));

// Global Error Handler
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }
  res.status(500).json({ success: false, message: "Server Error" });
});

export default app;
