import { Router } from "express";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

router
  .route("/")
  .post(authMiddleware, upload.array("images", 10), createProperty)
  .get(getAllProperties);

router
  .route("/:id")
  .get(getPropertyById)
  .put(authMiddleware, upload.array("images", 10), updateProperty)
  .delete(authMiddleware, deleteProperty);

export default router;
