import { Router } from "express";
import {
  createContact,
  getAllContacts,
  deleteContact,
} from "../controllers/contact.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import isAdminMiddleware from "../middleware/isAdmin.middleware.js";

const router = Router();

// Public
router.route("/").post(createContact);

// Admin only
router.route("/").get(authMiddleware, isAdminMiddleware, getAllContacts);
router.route("/:id").delete(authMiddleware, isAdminMiddleware, deleteContact);

export default router;
