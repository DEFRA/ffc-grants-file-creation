const server = require('./server')

const init = async () => {
  const createSpreadsheetAction = require('./messaging/create-spreadsheet')
  require('./messaging/receivers').startSubmissionReceiver(createSpreadsheetAction)

  await server.start()
  console.log('Server running on %s', server.info.uri)

  const { sendFileCreated } = require('./messaging/senders')
  await sendFileCreated({ test: 'testing new access key' })
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
