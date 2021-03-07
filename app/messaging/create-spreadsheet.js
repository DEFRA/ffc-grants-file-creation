const { sendFileCreated } = require('./senders')

module.exports = async function (msg, submissionReceiver) {
  try {
    const { body } = msg
    console.log('Received message:')
    console.log(body)

    await sendFileCreated({ test: 'File has been created' })

    await submissionReceiver.completeMessage(msg)
  } catch (err) {
    console.err('Unable to process message')
    console.err(err)
    await submissionReceiver.abandonMessage(msg)
  }
}
