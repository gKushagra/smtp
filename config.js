require('dotenv').config();

var props = {};

props['port'] = process.env.PORT || 7653;

props['sendgrid'] = {
    apiKey: process.env.SG_API_KEY,
    verifiedSender: process.env.SG_VERIFIED_SENDER
}

props['smtp'] = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
};

props['imap'] = {
    host: process.env.IMAP_HOST,
    port: process.env.IMAP_PORT,
    tls: true,
    auth: {
        user: process.env.IMAP_USER,
        pass: process.env.IMAP_PASS
    },
    // authTimeout: 3000
};

module.exports = props;
