const msgCfg = require('../config/messaging')
const { MessageReceiver } = require('ffc-messaging')

let notificationReceiver

async function stop () {
  await notificationReceiver.closeConnection()
}

process.on('SIGTERM', async () => {
  await stop()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await stop()
  process.exit(0)
})

module.exports = {
  startSubmissionReceived: async function (submissionReceived) {
    const updateAction = msg => submissionReceived(msg, notificationReceiver)
    notificationReceiver = new MessageReceiver(msgCfg.notificationSubscription, updateAction)
    await notificationReceiver.subscribe()
  }
}
