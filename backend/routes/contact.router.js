import { Router } from "express";
import {
  createContact,
  getAllContacts,
  deleteContact,
} from "../controllers/contact.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import isAdminMiddleware from "../middleware/isAdmin.middleware.js";

const router = Router();

// Public - anyone can submit a contact form
router.route("/").post(createContact);

// Admin only - get all contacts
router.route("/").get(authMiddleware, isAdminMiddleware, getAllContacts);

// Admin only - individual contact operations
router.route("/:id").delete(authMiddleware, isAdminMiddleware, deleteContact);

export default router;
