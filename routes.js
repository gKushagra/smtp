const config = require('./config');
const express = require('express');
const smtpService = require('./services/smtp.service');
const database = require('./utils/database');
const kafkaProducer = require('./utils/kafka');
const _logger = require('./utils/logger');

var router = express.Router();

router.post('/email/:service', async function (req, res, next) {
    const service = req.params.service;
    _logger.info(`received post request to /email using service ${service}`);
    const { to, subject, text, html } = req.body;
    const msg = { to, from: config.verifiedSender, subject, text, html };
    _logger.info(`composed message: ${msg}`);
    try {
        if (service === 'sendgrid') {
            var result = smtpService.sendThruSgMail(msg);
        } else {
            var result = smtpService.sendThruNodemailer(msg);
        }
        console.log(result);
        await kafkaProducer({
            to,
            success: "Email sent, appended and saved", // replace with result
            error: null
        }).catch(err => {
            console.log(err);
            _logger.error(`error in kafka producer ${err}`);
        });
        _logger.info(`email sent, appended and saved result: ${result}`);
        res.status(200).json('Email sent, appended and saved')
    } catch (error) {
        console.log(error);
        _logger.error(`error in sending, saving or appending email: ${error}`);
        await kafkaProducer({
            to,
            status: null,
            error
        }).catch(err => {
            console.log(err);
            _logger.error(`error in kafka producer ${err}`);
        });
        res.status(200).json(error);
    }
});

router.get('/email', async function (req, res, next) {
    _logger.info(`received a get request to /email`);
    const client = database.getClient();
    var logs = [];
    try {
        await client.connect();
        _logger.info(`connected to db`);
        var db = client.db(config.mongo.db);
        var collection = db.collection(config.mongo.coll);
        var cursor = collection.find();
        // print a message if no documents were found
        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
            _logger.info(`no saved emails found`);
        }
        // replace console.dir with your callback to access individual elements
        await cursor.forEach(d => { logs.push(d) });
    } catch (error) {
        console.log("Error occurred while retrieving emails", error)
        _logger.error(`error occurred while retrieving emails ${error}`);
        await kafkaProducer({
            message: "Error occurred while retrieving emails"
        }).catch(err => {
            console.log(err);
            _logger.error(`error in kafka producer ${err}`);
        });
        res.sendStatus(500);
    } finally {
        await client.close();
        _logger.info(`retrieved all emails`);
        await kafkaProducer({
            message: "Retrieved emails successfully"
        }).catch(err => {
            console.log(err);
            _logger.error(`error in kafka producer ${err}`);
        });
        res.status(200).json(logs);
    }
});

module.exports = router;