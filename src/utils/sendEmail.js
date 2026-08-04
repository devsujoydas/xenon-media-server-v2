const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_APP_USER,
    pass: process.env.EMAIL_APP_PASS, 
  },
});

const sendEmail = async ({
  to,
  subject,
  html,
  text = "Please open this email in an HTML compatible email client.",
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"Xenly Support" <${process.env.EMAIL_APP_USER}>`,
      to,
      subject,
      html,
      text,
    });

    console.log(`📨 Email sent: ${info.messageId}`);

    return info;
  } catch (error) {
    throw new Error("EMAIL_SEND_FAILED");
  }
};

module.exports = sendEmail;
