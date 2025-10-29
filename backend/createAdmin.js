import mongoose from "mongoose";
import { User } from "./models/User.model.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/network`);
    console.log("Connected to MongoDB");

    const adminEmail = "admin@gmail.com"; 

    const user = await User.findOne({ email: adminEmail });

    if (!user) {
      console.log("User not found. Please signup first with this email.");
      process.exit(1);
    }

    user.role = "admin";
    await user.save();

    console.log("✅ User upgraded to admin successfully!");
    console.log("Admin:", user.username, user.email);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

createAdmin();
