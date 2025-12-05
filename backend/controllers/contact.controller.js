import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Contact from "../models/Contact.model.js";

const createContact = AsyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if ([name, email, subject, message].some((f) => !f?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const contact = await Contact.create({ name, email, subject, message });

  return res
    .status(201)
    .json(new ApiResponse(201, contact, "Message sent successfully"));
});

const getAllContacts = AsyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, contacts, "Contacts retrieved"));
});

const deleteContact = AsyncHandler(async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, "Contact deleted"));
});

export { createContact, getAllContacts, deleteContact };
