const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_APP_USER,
    pass: process.env.EMAIL_APP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  logger: true,
  debug: true,
});

console.log(process.env.EMAIL_APP_USER);
console.log(process.env.EMAIL_APP_PASS?.length);

const sendEmail = async ({
  to,
  subject,
  html,
  text = "Please open this email in an HTML compatible email client.",
}) => {
  try {
    console.log("Enterd Send Email");
    console.log("Before sendMail");

    const info = await transporter.sendMail({
      from: `"Xenly Support" <${process.env.EMAIL_APP_USER}>`,
      to,
      subject,
      html,
      text,
    });

    console.log("After sendMail");
    console.log(info);

    console.log(`📨 Email sent: ${info.messageId}`);

    return info;
  } catch (error) {
    console.error("Full Email Error:", error);
    console.error("Code:", error.code);
    console.error("Command:", error.command);
    console.error("Response:", error.response);

    throw new Error("EMAIL_SEND_FAILED");
  }
};

module.exports = sendEmail;
