const AWSXRay = require('aws-xray-sdk')
AWSXRay.captureHTTPsGlobal(require('http'))
AWSXRay.captureHTTPsGlobal(require('https'))

app.use(AWSXRay.express.openSegment('message-microservice-v1'))

const serverless = require("serverless-http")
const express = require("express");
const app = express();

const routes = require("./routes/message.routes");

app.use(express.json());

app.use("/api/v1", routes);

app.use(AWSXRay.express.closeSegment())

module.exports.handler = serverless(app);
