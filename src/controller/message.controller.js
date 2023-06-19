const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN
const numberFromSendMessage = process.env.NUMBER_FROM_SEND_MESSAGE

const sendMessage = async (req, res, next) => {
  try {
    const { body, to } = req.body

    const client = require("twilio")(accountSid, authToken)

    await client.messages.create({
      body,
      from: numberFromSendMessage,
      to
    })

    return res.status(200).json({
      message: "Se envió el mensaje correctamente",
    })

  } catch (e) {
    if (e.code === 20003 && e.status === 401) {
      e.message = `${e.message}: Las credenciales del proveedor no son válidas`

      next(e)
      return
    }

    next(e)
  }
};

module.exports = {
  sendMessage
}
