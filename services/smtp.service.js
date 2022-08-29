const config = require('../config');
const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const imapService = require('../services/imap.service');

function sendThruSgMail({ to, from, subject, text, html }) {
    sgMail.setApiKey(process.env.API_KEY);

    sgMail
        .send(msg)
        .then(async () => {
            console.log("Email sent: N/A");

            await imapService.appendEmail(msg)
                .then(() => { return 'Email sent, appended and logged' })
                .catch(e => {
                    console.log("Error occurred while saving or appending email", e);
                    throw new Error(e);
                });
        })
        .catch((error) => {
            console.log("Error occurred sending email by sendgrid", error);
            throw new Error(error);
        });
}

function sendThruNodemailer(msg = { to, from, subject, text, html }) {
    const transporter = nodemailer.createTransport(config.smtp);

    try {
        var info = await transporter.sendMail(msg);
    } catch (error) {
        console.log("Error occurred while sending email thru nodemailer", error);
        throw new Error(error);
    } finally {
        console.log("Email sent: %s", info.messageId);
        msg['messageId'] = info.messageId;

        await imapService.appendEmail(msg)
            .then(() => { return 'Email sent, appended and logged' })
            .catch(e => {
                console.log("Error occurred while saving or appending email", e);
                throw new error(e);
            });
    }
}

module.exports = {
    sendThruSgMail,
    sendThruNodemailer
}