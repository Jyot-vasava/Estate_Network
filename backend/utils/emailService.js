import nodemailer from "nodemailer";

let transporter;

if (process.env.NODE_ENV === "production") {
  // Use your Gmail in production (after enabling 2FA + App Password)
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // ← App Password, not real password
    },
  });
} else {
  // Use Ethereal for development (instant preview link)
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "your-ethereal-email@ethereal.email", // Will auto-generate
      pass: "your-password",
    },
  });
}

// Auto-create Ethereal account on first send
const sendEmail = async (to, subject, text = "", html = "") => {
  if (!transporter) {
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
    console.log("Ethereal Email:", testAccount.user);
    console.log("Preview URL will appear below ↓");
  }

  const info = await transporter.sendMail({
    from: '"Estate Network" <no-reply@estatenetwork.com>',
    to,
    subject,
    text,
    html,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

export default sendEmail;



// import nodemailer from "nodemailer";

// const sendEmail = async (to, subject, text = "", html = "") => {
//   // Create transporter using Gmail + App Password
//   const transporter = nodemailer.createTransporter({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS, // ← 16-digit App Password
//     },
//   });

//   const mailOptions = {
//     from: `"Estate Network" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     text,
//     html,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log("REAL EMAIL SENT SUCCESSFULLY!");
//     console.log("To:", to);
//     console.log("Subject:", subject);
//     return info;
//   } catch (error) {
//     console.error("Email failed:", error.message);
//     throw error;
//   }
// };

// export default sendEmail;