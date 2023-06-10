const jwt = require("jsonwebtoken");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const numberFromSendMessage = process.env.NUMBER_FROM_SEND_MESSAGE;
const client = require("twilio")(accountSid, authToken);

app.use(bodyParser.json({ strict: false }));

async function authMiddleware(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      res
        .status(401)
        .send({ message: "No se encontro ningún token de autorización" });
      return;
    }

    const _token = authorization.replace("Bearer ", "");

    await jwt.verify(_token, "secret");
  } catch (e) {
    if (e.message === "invalid signatures") {
      res.status(400).send({ message: e.message });
    } else {
      res.status(500).send({ message: e.message, detail: e });
    }
  }

  next();
}

/**
 * 
  curl --location 'localhost:3000/send-message' \
  --header 'Content-Type: application/json' \
  --data '{
      "body": "vamooooooooooooh",
      "to": "+573153226435"
  }'
 * 
 */

app.post("/send-message", async (req, res, next) => {
  try {
    const { body, to } = req.body;

    await client.messages.create({
      body,
      from: numberFromSendMessage,
      to,
    });

    return res.status(200).json({
      message: "Se envió el mensaje correctamente",
    });
  } catch (e) {
    
    if(e.code === 20003 && e.status === 401) {

      e.message = `${e.message}: Las credenciales del proveedor no son validas`

      next(e)
      return 
    }

    next(e);
  }
});

module.exports.handler = serverless(app);
