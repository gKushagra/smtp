const config = require('../config');
const { v4: uuid } = require('uuid');
const { Kafka } = require('kafkajs');
const clientId = 'email-service';
const brokers = [config.kafka.bootstrapServers];
const topic = config.kafka.topic;

const kafka = new Kafka({ clientId, brokers });
const producer = kafka.producer();

const produce = async (data) => {
    await producer.connect();
    try {
        let traceId = uuid();
        await producer.send({
            topic,
            messages: [{ traceId, data }]
        });
    } catch (error) {
        console.log("Error occurred while producing message", error);
    }
}

module.exports = produce;