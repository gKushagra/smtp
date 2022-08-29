const config = require('../config');
const { MongoClient } = require('mongodb');

function getClient() {
    return new MongoClient(config.mongo.uri);
}

module.exports = {
    getClient,
}