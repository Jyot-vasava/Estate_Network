import { Router } from "express";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import {verifyUser} from "../middleware/auth.middleware.js";

const router = Router();

// Create property with image upload (protected route)
router.post("/", verifyUser, upload.array("images", 10), createProperty);

// Get all properties (public route)
router.get("/", getAllProperties);

// Get single property by ID (public route)
router.get("/:id", getPropertyById);

// Update property (protected route)
router.put("/:id", verifyUser, upload.array("images", 10), updateProperty);

// Delete property (protected route)
router.delete("/:id", verifyUser, deleteProperty);

export default router;
