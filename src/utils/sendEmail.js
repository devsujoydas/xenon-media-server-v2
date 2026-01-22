const nodemailer = require("nodemailer");

/**
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 * @param {string} [text]
 */
const sendEmail = async (to, subject, html, text) => {
  try { 
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
 
    const mailOptions = {
      from: `"Xenon-Media-V2 Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text: text || "Please view this email in an HTML-compatible viewer.",
      headers: {
        "X-Priority": "3",
        "X-Mailer": "Xenon-Media-V2 Mail Service",
      },
    };
 
    const info = await transporter.sendMail(mailOptions);
   

    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send email. Please try again later.");
  }
};

module.exports = sendEmail;
