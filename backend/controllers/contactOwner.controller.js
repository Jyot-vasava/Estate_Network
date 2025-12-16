import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import sendEmail from "../utils/emailService.js";

const contactOwner = AsyncHandler(async (req, res) => {
  const { name, email, message, ownerEmail } = req.body;

  // Validate required fields
  if (!name || !email || !message || !ownerEmail) {
    throw new ApiError(400, "All fields are required");
  }

  // Validate email formats
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid sender email format");
  }
  if (!emailRegex.test(ownerEmail)) {
    throw new ApiError(400, "Invalid owner email format");
  }

  const subject = `Property Inquiry from ${name}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4a5568; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f7fafc; padding: 20px; margin-top: 20px; }
        .message-box { background-color: white; padding: 15px; border-left: 4px solid #4a5568; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #718096; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Property Inquiry</h2>
        </div>
        <div class="content">
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <div class="message-box">
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
          </div>
        </div>
        <div class="footer">
          <p>You can reply directly to this email to respond to ${name}.</p>
          <p>Reply-To: ${email}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const emailResult = await sendEmail(ownerEmail, subject, "", html);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          emailResult,
          "Message sent to property owner successfully"
        )
      );
  } catch (error) {
    console.error("Email error:", error);
    throw new ApiError(
      500,
      "Failed to send email. Please check your SMTP configuration or try again later."
    );
  }
});

export { contactOwner };
