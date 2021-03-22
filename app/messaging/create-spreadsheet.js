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

  Object.entries(body.applicationDetails)
    .forEach(([fieldName, fieldValue]) => worksheet.addRow({ fieldName, fieldValue }))

  const buffer = await workbook.xlsx.writeBuffer()

  const filename = `${body.confirmationNumber}.xlsx`
  const { BlobServiceClient } = require('@azure/storage-blob')
  const connStr = process.env.BLOB_STORAGE_CONNECTION_STRING
  const blobServiceClient = BlobServiceClient.fromConnectionString(connStr)
  const containerClient = blobServiceClient.getContainerClient('paul-test')
  const blockBlobClient = containerClient.getBlockBlobClient(filename)

  // Upload data to the blob
  const uploadBlobResponse = await blockBlobClient.upload(buffer, buffer.byteLength)
  console.log('Blob was uploaded successfully')
  console.log(uploadBlobResponse)

  return filename
}

module.exports = async function (msg, submissionReceiver) {
  try {
    const { body } = msg
    console.log('Received message:')
    console.log(body)

    const filename = await createTest(body)
    await sendFileCreated({ filename })

    await submissionReceiver.completeMessage(msg)
  } catch (err) {
    console.error('Unable to process message')
    console.error(err)
    await submissionReceiver.abandonMessage(msg)
  }
}
