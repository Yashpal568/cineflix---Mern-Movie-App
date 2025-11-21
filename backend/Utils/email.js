const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
  try {
    // 1. Create Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // 2. Define Email Options
    const mailOptions = {
      from: 'Cineflix Support <support@cineflix.com>',
      to: option.email,
      subject: option.subject,
      text: option.message,
    };

    // 3. Send Email
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
    throw new Error(err.message);
  }
};

module.exports = sendEmail;
