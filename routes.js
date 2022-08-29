const config = require('./config');
const express = require('express');
const smtpService = require('./services/smtp.service');
const database = require('./utils/database');
var router = express.Router();

router.post('/email/:service', async function (req, res, next) {
    const { to, subject, text, html } = req.body;
    const msg = { to, from: config.verifiedSender, subject, text, html };
    const service = req.params.service;
    try {
        if (service === 'sendgrid') {
            var result = smtpService.sendThruSgMail(msg);
        } else {
            var result = smtpService.sendThruNodemailer(msg);
        }
        console.log(result);
        res.status(200).json('Email sent, appended and logged')
    } catch (error) {
        console.log(error);
        res.status(200).json('Email sent but not appended or logged');
    }
});

router.get('/email', async function (req, res, next) {
    const client = database.getClient();
    var logs = [];
    try {
        await client.connect();
        var db = client.db(db);
        var collection = db.collection(coll);
        var cursor = collection.find();
        // print a message if no documents were found
        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }
        // replace console.dir with your callback to access individual elements
        await cursor.forEach(d => { logs.push(d) });
    } catch (error) {
        console.log("Error occurred while retrieving emails", error)
        res.sendStatus(500);
    } finally {
        await client.close();
        res.status(200).json(logs);
    }
});

module.exports = router;