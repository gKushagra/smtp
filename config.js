require('dotenv').config();

var props = {};

props['port'] = process.env.PORT || 5777;

props['mongo'] = {
    uri: process.env.MONGO_URI,
    db: process.env.MONGO_DB,
    coll: process.env.MONGO_COLL
};

props['sendgrid'] = process.env.API_KEY;

props['verifiedSender'] = process.env.VRF_SENDER;

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
    authTimeout: 3000
};

props['kafka'] = {
    topic: process.env.KAFKA_TOPIC,
    bootstrapServers: process.env.KAFKA_URL
};

props['zipkin'] = process.env.ZIPKIN_URL;

module.exports = props;
