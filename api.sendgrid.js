require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const sgMail = require('@sendgrid/mail')
const db = process.env.MONGO_DB;
const coll = process.env.MONGO_COLL;
const verfSender = process.env.VRF_SENDER;

var router = express.Router();

const mongoUri = process.env.MONGO_URI;
const client = new MongoClient(mongoUri);

sgMail.setApiKey(process.env.API_KEY)

router.post('/email', function (req, res, next) {

    const { to, subject, text, html } = req.body;

    const msg = { to, from: verfSender, subject, text, html };

    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent');

            try {
                await client.connect();
                var database = client.db(db);
                var collection = database.collection(coll);
                await collection.insertOne(doc);
            } catch (error) {
                throw new Error(error);
            } finally {
                await client.close();
                res.status(200).json('Email sent and logged');
            }
        })
        .catch((error) => {
            console.error(error)
            res.sendStatus(500);
        });

});

router.get('/email', function (req, res, next) {

    var logs = [];

    try {
        await client.connect();
        var database = client.db(db);
        var collection = database.collection(coll);
        var cursor = collection.findOne(query, options);

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

module.exports = router;