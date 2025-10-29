import nodemailer from "nodemailer";
import { asyncHandler } from "../utils/AsyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const contactOwner = asyncHandler(async (req, res) => {
  const { name, email, message, ownerEmail } = req.body;

  console.log("📧 Contact Owner Request:", { name, email, ownerEmail });

  try {
    // Validation
    if (!name || !email || !message || !ownerEmail) {
      throw new ApiError(400, "All fields are required");
    }

    // Create Ethereal test account (generates new credentials each time)
    console.log("🔄 Creating Ethereal test account...");
    const testAccount = await nodemailer.createTestAccount();

    console.log("✅ Ethereal account created:", testAccount.user);

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Verify transporter
    await transporter.verify();
    console.log("✅ Transporter verified successfully");

    // Email content
    const mailOptions = {
      from: `"${name}" <${testAccount.user}>`, // Use Ethereal email as sender
      to: ownerEmail,
      replyTo: email, // Real user's email for replies
      subject: `Property Inquiry from ${name}`,
      text: `You have received a message from ${name} (${email}):\n\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">Property Inquiry</h2>
          <hr style="border: 1px solid #e5e7eb;">
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;">${message}</p>
          </div>
          <hr style="border: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280;">
            Reply directly to this email to respond to ${name} at ${email}
          </p>
        </div>
      `,
    };

    // Send email
    console.log("📤 Sending email...");
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully!");
    console.log("📧 Message ID:", info.messageId);
    console.log("🔗 Preview URL:", nodemailer.getTestMessageUrl(info));
    console.log(
      "\n👆 Copy the preview URL above and paste it in your browser to see the email!\n"
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          previewUrl: nodemailer.getTestMessageUrl(info),
          messageId: info.messageId,
        },
        "Email sent successfully! Check backend console for preview URL."
      )
    );
  } catch (error) {
    console.error("❌ Error in contactOwner:", error);
    throw new ApiError(
      500,
      error.message || "Failed to send email, please try again later"
    );
  }
});


export {contactOwner}