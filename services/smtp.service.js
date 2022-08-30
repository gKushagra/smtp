const config = require('../config');
const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const imapService = require('../services/imap.service');
const _logger = require('../utils/logger');

async function sendThruSgMail({ to, from, subject, text, html }) {
    sgMail.setApiKey(process.env.API_KEY);
    sgMail
        .send(msg)
        .then(async () => {
            console.log("Email sent: N/A");
            _logger.info(`email sent`);
            await imapService.appendEmail(msg)
                .then(() => { 
                    _logger.info(`email sent appended and logged`);
                    return 'Email sent, appended and logged' 
                })
                .catch(e => {
                    console.log("Error occurred while saving or appending email", e);
                    _logger.error(`error occurred while saving or appending email ${e}`);
                    throw new Error("Error occurred while saving or appending email");
                });
        })
        .catch((error) => {
            console.log("Error occurred sending email by sendgrid", error);
            _logger.error(`error occurred while sending email by sendgrid ${error}`);
            throw new Error("Error occurred sending email by sendgrid");
        });
}

async function sendThruNodemailer(msg = { to, from, subject, text, html }) {
    const transporter = nodemailer.createTransport(config.smtp);
    try {
        var info = await transporter.sendMail(msg);
    } catch (error) {
        console.log("Error occurred while sending email thru nodemailer", error);
        _logger.error(`error occurred while sending email thru nodemailer ${error}`);
        throw new Error("Error occurred while sending email thru nodemailer");
    } finally {
        console.log("Email sent: %s", info.messageId);
        msg['messageId'] = info.messageId;
        _logger.info(`email sent`);
        await imapService.appendEmail(msg)
            .then(() => { 
                _logger.info(`email sent, appended and logged`);
                return 'Email sent, appended and logged' 
            })
            .catch(e => {
                console.log("Error occurred while saving or appending email", e);
                _logger.error(`error occurred while saving or appending email ${e}`);
                throw new error("Error occurred while saving or appending email");
            });
    }
}

module.exports = {
    sendThruSgMail,
    sendThruNodemailer
}