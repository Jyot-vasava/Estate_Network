import { Router } from "express";
import {
  createContact,
  getAllContacts,
  getContactById,
  deleteContact,
} from "../controllers/contact.controller.js";
import {verifyUser} from "../middleware/auth.middleware.js";
import {isAdmin} from "../middleware/isAdmin.middleware.js";

const router = Router();

// Submit contact form (public route)
router.post("/", createContact);

// Get all contacts - admin only (protected route)
router.get("/", verifyUser, isAdmin, getAllContacts);

// Get single contact by ID - admin only (protected route)
router.get("/:id", verifyUser, isAdmin, getContactById);

// Delete contact - admin only (protected route)
router.delete("/:id", verifyUser, isAdmin, deleteContact);

export default router;
