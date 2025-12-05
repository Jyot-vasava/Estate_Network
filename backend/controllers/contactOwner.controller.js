import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import sendEmail from "../utils/emailService.js";

const contactOwner = AsyncHandler(async (req, res) => {
  const { name, email, message, ownerEmail } = req.body;

  if (!name || !email || !message || !ownerEmail) {
    throw new ApiError(400, "All fields are required");
  }

  const subject = `Property Inquiry from ${name}`;
  const html = `
    <h3>New Property Inquiry</h3>
    <p><strong>From:</strong> ${name} (${email})</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, "<br>")}</p>
    <hr>
    <small>Reply directly to: ${email}</small>
  `;

  await sendEmail(ownerEmail, subject, "", html);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Message sent to owner"));
});

export { contactOwner };
