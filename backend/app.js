// app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ApiError from "./utils/ApiError.js";
import userRouter from "./routes/user.router.js";
import propertyRouter from "./routes/property.router.js";
import contactRouter from "./routes/contact.router.js";
import contactOwnerRouter from "./routes/contactOwner.router.js";
import adminRouter from "./routes/admin.router.js";

const app = express();

// Flexible CORS - accepts multiple origins
const allowedOrigins = [
  "http://localhost:3000", // React default
  "http://localhost:5173", // Vite default
  process.env.CORS_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/contacts", contactRouter);
app.use("/api/v1/contact-owner", contactOwnerRouter);
app.use("/api/v1/admin", adminRouter);

// Health check
app.get("/", (req, res) =>
  res.json({ success: true, message: "Estate Network API is running" })
);

// 404 handler
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

  // Log unexpected errors
  console.error("Unexpected Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
