import nodemailer from "nodemailer";

/**
 * Utility to send emails via Nodemailer
 * @param {string} email - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} htmlContent - HTML body of the email
 */
const sendEmail = async (email, subject, htmlContent) => {
  try {
    // 1. Create a transporter
    // If using Gmail, ensure you use an "App Password" from Google Account settings
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail (e.g., skillverse@gmail.com)
        pass: process.env.EMAIL_PASS, // Your 16-character App Password
      },
    });

    // 2. Define email options
    const mailOptions = {
      from: `"SkillVerse Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: htmlContent,
    };

    // 3. Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;
