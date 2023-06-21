const AWSXRay = require('aws-xray-sdk')
AWSXRay.captureHTTPsGlobal(require('http'))
AWSXRay.captureHTTPsGlobal(require('https'))

const serverless = require("serverless-http")
const express = require("express");
const app = express();

const routes = require("./routes/message.routes");

app.use(express.json());

app.use("/api/v1", routes);

module.exports.handler = serverless(app);
