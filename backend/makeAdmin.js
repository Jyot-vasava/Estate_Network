// makeAdmin.js
import mongoose from "mongoose";
import User from "./models/User.model.js"; 
import dotenv from "dotenv";
dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI + "/network");
    console.log("Connected to DB");

    const adminEmail = "admin@gmail.com"; 

    const user = await User.findOneAndUpdate(
      { email: adminEmail },
      { role: "admin", password: "Admin$321" },
      { new: true }
    );

    if (!user) {
      console.log("User not found! Register first.");
    } else {
      console.log("ADMIN CREATED SUCCESSFULLY");
      console.log("Name:", user.username);
      console.log("Email:", user.email);
      console.log("Role:", user.role);
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    process.exit();
  }
};

createAdmin();
