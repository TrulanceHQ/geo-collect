const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST,
  port: Number(process.env.BREVO_PORT),
  secure: false, // Use `true` for port 465, `false` for other ports
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Allow insecure connections
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to SMTP server:', error);
  } else {
    console.log('SMTP server is ready to take messages:', success);
  }
});