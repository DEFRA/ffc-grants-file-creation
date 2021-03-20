const { sendFileCreated } = require('./senders')
const ExcelJS = require('exceljs')

async function createTest (body) {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'ffc-grants-file-creation'
  workbook.created = new Date()

  const worksheet = workbook.addWorksheet('DORA DATA')
  const columnWidth = 50

  worksheet.columns = [
    { header: '', key: 'categories', width: columnWidth },
    { header: 'Field Name', key: 'fieldName', width: columnWidth },
    { header: 'Field Value', key: 'fieldValue', width: columnWidth }
  ]

  worksheet.getRow(1).font = { bold: true }
  worksheet.addRow({ fieldName: 'Surname:', fieldValue: 'Bloggs' })
  worksheet.addRow({ fieldName: 'Forename:', fieldValue: 'Joe' })
  worksheet.addRow({ fieldName: 'Email:', fieldValue: 'joe.bloggs@example.com' })
  worksheet.addRow({ fieldName: 'Blah:', fieldValue: 'wooo' })

  const buffer = await workbook.xlsx.writeBuffer()

  const { BlobServiceClient } = require('@azure/storage-blob')
  const connStr = process.env.BLOB_STORAGE_CONNECTION_STRING
  const blobServiceClient = BlobServiceClient.fromConnectionString(connStr)
  const containerClient = blobServiceClient.getContainerClient('blah')
  const blockBlobClient = containerClient.getBlockBlobClient('test-paul2.xlsx')

  // Upload data to the blob
  const uploadBlobResponse = await blockBlobClient.upload(buffer, buffer.byteLength)
  console.log('Blob was uploaded successfully')
  console.log(uploadBlobResponse)
}

module.exports = async function (msg, submissionReceiver) {
  try {
    const { body } = msg
    console.log('Received message:')
    console.log(body)

    console.log(`Created ${await createTest(body)}`)

    await sendFileCreated({ test: 'File has been created' })

    await submissionReceiver.completeMessage(msg)
  } catch (err) {
    console.error('Unable to process message')
    console.error(err)
    await submissionReceiver.abandonMessage(msg)
  }
}
