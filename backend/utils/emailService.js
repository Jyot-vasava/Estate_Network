import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (to, subject, text, html) => {
  try {
    // Create a test account if no SMTP credentials are provided
    let transporter;

    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      // Production configuration
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === "true", 
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Development mode - use Ethereal Email (test account)
      console.log(
        "⚠️  No SMTP credentials found. Using Ethereal test account..."
      );

      const testAccount = await nodemailer.createTestAccount();

      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    // Send email
    const info = await transporter.sendMail({
      from:
        process.env.SMTP_FROM || '"Estate Network" <noreply@estatenetwork.com>',
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);

    // If using Ethereal, get preview URL
    if (!process.env.SMTP_HOST) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log("📧 Preview URL:", previewUrl);
      return { success: true, previewUrl };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default sendEmail;
