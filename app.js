const config = require('./config');
const express = require('express');
const nodemailer = require('nodemailer');
const imap = require('imap-simple');
const mimemessage = require('mimemessage');
const cors = require('cors');
const axios = require('axios').default;

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

/** single sign on integration - verify authorization token */
function checkAuth(req, res, next) {
    const token = req.headers.authorization;
    if (token && token !== '') {
        axios.post(singleSignOn + '/verify?redirectUri=' + redirectUri)
            .then(function (response) {
                if (response.status === 401) { res.status(401).json("Unauthorized"); }
                else { next(); }
            })
            .catch(function (error) { res.status(500).json(error); });
    } else {
        res.status(401).json("Unauthorized");
    }
}

app.post('/', checkAuth, async function (req, res) {
    const { to, from, subject, text, html } = req.body;
    const msg = { to, from, subject, text, html };
    const transporter = nodemailer.createTransport(config.SMTP);
    var info = await transporter.sendMail(msg);
    msg['messageId'] = info.messageId;
    imap.connect(config.IMAP)
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

app.listen(config.PORT, () => {
    console.log(`Email server listening in port:${config.PORT}`)
});
