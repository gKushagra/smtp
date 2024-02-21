const config = require('./config');
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.post('/', checkAuth, async function(req, res) {
  try {
    const {to, from, subject, text, html} = req.body;
    const msg = {to, from, subject, text, html};
    const transporter = nodemailer.createTransport(config.SMTP);
    const info = await transporter.sendMail(msg);
  } catch (error) {
    console.error(error);
    res.status(500).json('Error: Unable to send email at this time.');
  }
});

app.listen(config.PORT, () => {
  console.log(`Email server listening in port:${config.PORT}`);
});
