const config = require('../config');
const database = require('../utils/database');
const imap = require('imap-simple');
const mimemessage = require('mimemessage');
const _logger = require('../utils/logger');

async function appendEmail(msg) {
    const client = database.getClient();
    _logger.info(`now appending email`);
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect();
            _logger.info(`connected to db`);
            var database = client.db(config.mongo.db);
            var collection = database.collection(config.mongo.coll);
            await collection.insertOne(msg);
        } catch (error) {
            console.log("Error occurred while adding email to database", error);
            _logger.error(`error occurred while adding email to database ${error}`);
            reject();
        } finally {
            await client.close();
            imap.connect({ imap: config.imap })
                .then(function (connection) {
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
                    _logger.info(`message appended to sentbox`);
                })
                .catch(e => {
                    console.log("Error occurred while appending email", e);
                    _logger.error(`error occurred while appending email ${e}`);
                    reject();
                });

            resolve();
        }
    });
}

module.exports = {
    appendEmail,
}

