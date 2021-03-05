const { fileCreated } = require('./senders')

module.exports = async function (msg, notificationReceiver) {
  try {
    const { body } = msg
    console.log(`Received message: ${body}`)

    await fileCreated({ test: 'File has been created' })

    await notificationReceiver.completeMessage(msg)
  } catch (err) {
    console.err('Unable to process message')
    console.err(err)
    await notificationReceiver.abandonMessage(msg)
  }
}
