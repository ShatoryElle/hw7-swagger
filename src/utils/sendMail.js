import nodemailer from 'nodemailer';
import createError from 'http-errors';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendMail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent info:', info);
  } catch (error) {
    console.error('Email sending error:', error.message);
    throw createError(500, 'Failed to send the email, please try again later.');
  }
};


export default sendMail;