const config = require('../config');
const { Tracer, ExplicitContext, BatchRecorder, jsonEncoder } = require('zipkin');
const { HttpLogger } = require('zipkin-transport-http');

export const tracer = new Tracer({
    ctxImpl: new ExplicitContext(),
    recorder: new BatchRecorder({
        logger: new HttpLogger({
            endpoint: `${config.zipkin}/api/v2/spans`,
            jsonEncoder: jsonEncoder.JSON_V2,
        }),
    }),
    localServiceName: "email-service",
});