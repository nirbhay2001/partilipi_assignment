require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  service: process.env.SMTP_SERVICE,
  secure: true,
  auth: {
    user: process.env.SMPT_MAIL,
    pass: process.env.SMPT_PASSWORD,
    
  },
});
const sendEmailNotification = async (userEmail, subject, content,  notificationId) => {

  const trackingPixelUrl = `http://notification_service:6000/track-email-read/${notificationId}`;
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: userEmail,
    subject: subject,
    html: `
      <p>${content}</p>
      <img src="${trackingPixelUrl}" width="1" height="1" alt="tracking-pixel" />
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('email sent successfully to:', userEmail);
  } catch (error) {
    console.error('error sending email:', error);
  }
};

module.exports = sendEmailNotification;

