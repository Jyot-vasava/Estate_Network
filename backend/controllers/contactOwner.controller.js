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

  try {
    const emailResult = await sendEmail(ownerEmail, subject, "", html);

    return res
      .status(200)
      .json(
        new ApiResponse(200, emailResult, "Message sent to owner successfully")
      );
  } catch (error) {
    console.error("Email error:", error);
    throw new ApiError(500, "Failed to send email. Please try again later.");
  }
});

export { contactOwner };
