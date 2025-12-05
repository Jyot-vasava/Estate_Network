import { Router } from "express";
import { makeAdmin } from "../controllers/admin.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import isAdminMiddleware from "../middleware/isAdmin.middleware.js";

const router = Router();

router.route("/make-admin").post(authMiddleware, isAdminMiddleware, makeAdmin);

export default router;
