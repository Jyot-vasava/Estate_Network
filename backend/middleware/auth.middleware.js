import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js";

const verifyUser = asyncHandler(async (req,_,next) =>{
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Access denied. No token provided.");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log("Token decoded:", decoded);
    } catch (jwtError) {
      console.error("JWT Error:", jwtError.message);
      if (jwtError.name === "TokenExpiredError") {
        throw new ApiError(401, "Token has expired. Please login again.");
      } else if (jwtError.name === "JsonWebTokenError") {
        throw new ApiError(401, "Invalid token format or signature.");
      } else {
        throw new ApiError(
          401,
          `Token verification failed: ${jwtError.message}`
        );
      }
    }

     const user = await User.findById(decoded?._id).select(
       "-password -refreshToken"
     );

     if (!user) {
       throw new ApiError(404, "User not found.");
     }

     req.user = user;
     next();
    
  } catch (error) {
    console.error("Auth Middleware error : ", error);
    next(new ApiError(401, "Invalid token."));
  }
})
  

export  {verifyUser};