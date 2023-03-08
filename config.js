require('dotenv').config();

exports.PORT = process.env.PORT || 7653;

exports.SMTP = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
};

exports.IMAP = {
    imap: {
        user: process.env.IMAP_USER,
        password: process.env.IMAP_PASS,
        host: process.env.IMAP_HOST,
        port: process.env.IMAP_PORT,
        tls: true,
        authTimeout: 3000
    }
};

exports.SENDGRID = {
    apiKey: process.env.SG_API_KEY
}