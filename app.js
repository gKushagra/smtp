const config = require('./config');
const express = require('express');
const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const imap = require('imap-simple');
const mimemessage = require('mimemessage');
const cors = require('cors');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const SERVICE = {
    SENDGRID: 'sendgrid',
    NODEMAILER: 'nodemailer'
}

async function appendEmail(res, msg) {
    imap.connect({ imap: config.imap })
        .then(function (connection) {
            var message = mimemessage.factory({
                contentType: 'multipart/mixed',
                body: []
            });
            message.header('From', msg.from);
            message.header('To', msg.to);
            message.header('Subject', msg.subject);
            message.header('Message-ID', msg.messageId ? message.messageId : '');
            var htmlEntity = mimemessage.factory({
                contentType: 'text/html;charset=utf-8',
                body: msg.html
            });
            message.body.push(htmlEntity);
            connection.append(message.toString(), { mailbox: 'Sent', });
            return res.status(200).json({ text: "Email sent and added to Sent mailbox." })
        })
        .catch(function (error) {
            console.error(error);
            return res.status(500).json(error);
        });
}

app.post('/', async function (req, res, next) {
    const { service, to, subject, text, html } = req.body;
    const message = { to, from: config.sendgrid.verifiedSender, subject, text, html };
    if (service === SERVICE.NODEMAILER) {
        const transporter = nodemailer.createTransport(config.smtp);
        var info = await transporter.sendMail(message);
        message['messageId'] = info.messageId;
        return await appendEmail(res, message);
    }
    else if (service === SERVICE.SENDGRID) {
        sgMail.setApiKey(config.sendgrid.apiKey);
        sgMail.send(message)
            .then(async function () {
                return await appendEmail(res, message);
            })
            .catch(function (error) {
                console.error(error);
                return res.status(500).json(error);
            });
    } else {
        return res.status(400).json({ error: "Invalid service" });
    }
});

app.listen(config.port, () => {
    console.log(`Email server listening in port:${config.port}`)
});
