import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (to, subject, text, html) => {
  try {
    let transporter;

    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      // Production configuration with corrected SSL/TLS settings
      const smtpPort = parseInt(process.env.SMTP_PORT) || 587;

      // Port 465 uses SSL (secure: true)
      // Port 587 uses STARTTLS (secure: false)
      const isSecure = smtpPort === 465;

      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: smtpPort,
        secure: isSecure, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          // Do not fail on invalid certs (useful for development)
          rejectUnauthorized: false,
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

    // Verify connection configuration
    await transporter.verify();
    console.log("✅ SMTP connection verified");

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

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default sendEmail;
