const server = require('./server')

const init = async () => {
  const createSpreadsheetAction = require('./messaging/create-spreadsheet')
  require('./messaging/receivers').startSubmissionReceiver(createSpreadsheetAction)

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
