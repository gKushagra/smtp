require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 6569,
  SMTP: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
};
