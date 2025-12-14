// makeAdmin.js
import mongoose from "mongoose";
import User from "./models/User.model.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI + "/network");
    console.log("Connected to DB");

    const adminEmail = "admin@gmail.com";
    const newPassword = "Admin$321";

    // Hash password manually since findOneAndUpdate bypasses pre-save hooks
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findOneAndUpdate(
      { email: adminEmail },
      { role: "admin", password: hashedPassword },
      { new: true }
    );

    if (!user) {
      console.log("❌ User not found! Register first with this email.");
    } else {
      console.log("✅ ADMIN CREATED SUCCESSFULLY");
      console.log("Username:", user.username);
      console.log("Email:", user.email);
      console.log("Role:", user.role);
      console.log("\n🔐 Login credentials:");
      console.log("Email:", adminEmail);
      console.log("Password:", newPassword);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

createAdmin();
