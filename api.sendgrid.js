require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');
const imap = require('imap-simple');
const mimemessage = require('mimemessage');
const sgMail = require('@sendgrid/mail')
const db = process.env.MONGO_DB;
const coll = process.env.MONGO_COLL;
const verfSender = process.env.VRF_SENDER;

var router = express.Router();

const mongoUri = process.env.MONGO_URI;
const client = new MongoClient(mongoUri);

sgMail.setApiKey(process.env.API_KEY)

router.post('/email/:service', async function (req, res, next) {

    const { to, subject, text, html } = req.body;

    const msg = { to, from: verfSender, subject, text, html };

    const provider = req.params.service;

    if (provider === 'sendgrid') {
        sgMail
            .send(msg)
            .then(async () => {
                console.log("Message sent: N/A");

                await saveAndAppendEmail(msg)
                    .then(() => res.status(200).json('Email sent, appended and logged'))
                    .catch(e => {
                        console.log(e);
                        res.status(200).json('Email sent but not appended or logged');
                    });
            })
            .catch((error) => {
                console.error(error)
                res.sendStatus(500);
            });
    } else {
        let transporter = nodemailer.createTransport({
            host: process.env.PE_HOST_1,
            port: process.env.PE_PORT_1,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.PE_DOMAIN,
                pass: process.env.PE_KEY
            },
        });

        try {
            var info = await transporter.sendMail({
                from: msg.from, // sender address
                to: msg.to, // list of receivers
                subject: msg.subject, // Subject line
                text: msg.text, // plain text body
                html: msg.html, // html body
            });
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            console.log("Message sent: %s", info.messageId);
            msg['nodemailer_id'] = info.messageId;

            await saveAndAppendEmail(msg)
                .then(() => res.status(200).json('Email sent, appended and logged'))
                .catch(e => {
                    console.log(e);
                    res.status(200).json('Email sent but not appended or logged')
                });
        }
    }

});

router.get('/email', async function (req, res, next) {

    var logs = [];

    try {
        await client.connect();
        var database = client.db(db);
        var collection = database.collection(coll);
        var cursor = collection.find();

        // print a message if no documents were found
        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }
        // replace console.dir with your callback to access individual elements
        await cursor.forEach(d => { logs.push(d) });
    } catch (error) {
        throw new Error(error);
        res.sendStatus(500);
    } finally {
        await client.close();
        res.status(200).json(logs);
    }

});

async function saveAndAppendEmail(msg) {
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect();
            var database = client.db(db);
            var collection = database.collection(coll);
            await collection.insertOne(msg);
        } catch (error) {
            console.log(error);

        } finally {
            await client.close();
            imap.connect({
                imap: {
                    user: process.env.PE_DOMAIN,
                    password: process.env.PE_KEY,
                    host: process.env.PE_HOST_2,
                    port: process.env.PE_PORT_2,
                    tls: true,
                    authTimeout: 3000
                }

            }).then(function (connection) {
                var message = mimemessage.factory({
                    contentType: 'multipart/mixed',
                    body: []
                });
                message.header('From', msg.from);
                message.header('To', msg.to);
                message.header('Subject', msg.subject);
                message.header('Message-ID', msg.nodemailer_id);
                var htmlEntity = mimemessage.factory({
                    contentType: 'text/html;charset=utf-8',
                    body: msg.html
                });
                message.body.push(htmlEntity);

                connection.append(message.toString(), { mailbox: 'Sent', });

            }).catch(e => console.log(e));
            resolve();
        }
    });
}

module.exports = router;