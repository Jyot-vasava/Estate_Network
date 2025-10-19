import { Contact } from "../models/Contact.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";

// Handle contact form submission
const createContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    throw new ApiError(400, "All fields are required");
  }

  const newContact = new Contact({ name, email, subject, message });
  await newContact.save();

  // Log to console for visibility
  console.log("\n" + "=".repeat(60));
  console.log("📨 NEW CONTACT MESSAGE RECEIVED");
  console.log("=".repeat(60));
  console.log("👤 Name:", name);
  console.log("📧 Email:", email);
  console.log("📋 Subject:", subject);
  console.log("💬 Message:", message);
  console.log("🕐 Time:", new Date().toLocaleString());
  console.log("=".repeat(60) + "\n");

  return res
    .status(201)
    .json(new ApiResponse(201, newContact, "Message sent successfully!"));
});

// Get all contact messages (optional - for admin)
const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, contacts, "Contacts fetched successfully"));
});

// Get single contact by ID (optional - for admin)
const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, contact, "Contact fetched successfully"));
});

// Delete contact message (optional - for admin)
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Contact deleted successfully"));
});

export { createContact, getAllContacts, getContactById, deleteContact };
