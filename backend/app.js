import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());

// Import routes
import userRouter from "./routes/user.router.js";
import propertyRouter from "./routes/property.router.js";
import bookingRouter from "./routes/booking.router.js";
import contactRouter from "./routes/contact.router.js";
import contactOwnerRouter from "./routes/contactOwner.router.js";

// Route declarations
app.use("/api/v1/users", userRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/contacts", contactRouter);
app.use("/api/v1", contactOwnerRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

export default app;
