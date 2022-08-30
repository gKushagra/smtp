const winston = require('winston');
const path = require('path');

const _logger = winston.createLogger({
    levels,
    format: winston.format.json(),
    defaultMeta: { service: 'email-service' },
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname + '/../logs/logs.json')
        })
    ]
});

module.exports = _logger;