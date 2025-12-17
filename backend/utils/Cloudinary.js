import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadToCloudinary = async (localPath) => {
  try {
    // Configure on first use (lazy loading)
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });



    if (!localPath) {
      return null;
    }

    if (!fs.existsSync(localPath)) {
      return null;
    }


    const result = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
      folder: "estate-network",
    });


    fs.unlinkSync(localPath);

    return result;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error.message);

    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }

    return null;
  }
};

export { uploadToCloudinary };
