const { MessageSender } = require('ffc-messaging')
const msgCfg = require('../config/messaging')

const fileCreatedSender = new MessageSender(msgCfg.fileCreatedTopic)

async function stop () {
  await fileCreatedSender.closeConnection()
}

process.on('SIGTERM', async () => {
  await stop()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await stop()
  process.exit(0)
})

async function sendMsg (sender, msgData, msgType) {
  const msg = {
    body: msgData,
    type: msgType,
    source: msgCfg.msgSrc
  }

  console.log('sending message', msg)

  await sender.sendMessage(msg)
}

module.exports = {
  fileCreated: async function (fileCreatedData) {
    await sendMsg(fileCreatedSender, fileCreatedData, msgCfg.fileCreatedMsgType)
  }
}
