import { Router } from "express";
import { contactOwner } from "../controllers/contactOwner.controller.js";

const router = Router();

router.route("/contact-owner").post(contactOwner);

export default router;
