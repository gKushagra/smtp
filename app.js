const config = require('./config');
const express = require('express');
const nodemailer = require('nodemailer');
const imap = require('imap-simple');
const mimemessage = require('mimemessage');
const cors = require('cors');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post('/', async function (req, res, next) {
    const { to, from, subject, text, html } = req.body;
    const msg = { to, from, subject, text, html };
    const transporter = nodemailer.createTransport(config.smtp);
    var info = await transporter.sendMail(msg);
    msg['messageId'] = info.messageId;
    imap.connect(config.imap)
        .then(function (connection) {
            var message = mimemessage.factory({
                contentType: 'multipart/mixed',
                body: []
            });
            message.header('From', msg.from);
            message.header('To', msg.to);
            message.header('Subject', msg.subject);
            message.header('Message-ID', msg.messageId);
            var htmlEntity = mimemessage.factory({
                contentType: 'text/html;charset=utf-8',
                body: msg.html
            });
            message.body.push(htmlEntity);
            connection.append(message.toString(), { mailbox: 'Sent', });
            res.status(200).json({ text: "Email sent and appended." })
        });
});

app.listen(config.port, () => {
    console.log(`Email server listening in port:${config.port}`)
});
