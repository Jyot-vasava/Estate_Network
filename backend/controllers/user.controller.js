import jwt from "jsonwebtoken";
import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/User.model.js";

const generateTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const signupUser = AsyncHandler(async (req, res) => {
  const { username, email, phone, password } = req.body;

  // Validate required fields
  if ([username, email, phone, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existedUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email }, { phone }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "User with this email, username, or phone already exists"
    );
  }

  // Create user
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    phone,
    password,
  });

  // Fetch created user without sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = AsyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  // Validate input
  if (!email && !username) {
    throw new ApiError(400, "Email or username is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  // Find user
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateTokens(user._id);

  // Get user without sensitive data
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Cookie options - FIXED for development
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only secure in production
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            _id: loggedInUser._id,
            username: loggedInUser.username,
            email: loggedInUser.email,
            phone: loggedInUser.phone,
            role: loggedInUser.role,
          },
          accessToken,
          refreshToken,
        },
        "Login successful"
      )
    );
});

const logoutUser = AsyncHandler(async (req, res) => {
  // Clear refresh token from database
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  // Cookie options - FIXED to match login
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

const refreshAccessToken = AsyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Find user
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // Check if refresh token matches
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
      user._id
    );

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export { signupUser, loginUser, logoutUser, refreshAccessToken };
