const { sendFileCreated } = require('./senders')
const ExcelJS = require('exceljs')

async function addWorksheet (workbook, worksheetData) {
  const worksheet = workbook.addWorksheet(worksheetData.title)

  if (worksheetData.defaultColumnWidth) {
    worksheet.properties.defaultColWidth = worksheetData.defaultColumnWidth
  }

  if (worksheetData.protectPassword) {
    await worksheet.protect(worksheetData.protectPassword)
  }

  worksheetData.rows.forEach(rowDetails => {
    const row = worksheet.getRow(rowDetails.row)
    row.values = rowDetails.values

    if (rowDetails.bold) {
      row.font = { bold: true }
    }
  })

  // Hide rows with no data that fall between rows that do have data
  if (worksheetData.hideEmptyRows) {
    const rowsWithData = worksheetData.rows.map(rowDetails => rowDetails.row)
    const lastRowWithData = Math.max(...rowsWithData)

    for (let rowNum = 1; rowNum < lastRowWithData; rowNum++) {
      if (!rowsWithData.includes(rowNum)) {
        const row = worksheet.getRow(rowNum)
        row.values = ['']
        row.hidden = true
      }
    }
  }
}

async function createTest (spreadsheetData) {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'ffc-grants-file-creation'
  workbook.created = new Date()

  for (const worksheet of spreadsheetData.worksheets) {
    await addWorksheet(workbook, worksheet)
  }

  const buffer = await workbook.xlsx.writeBuffer()

  const filename = spreadsheetData.filename
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
    console.log(JSON.stringify(body, null, 2))

    const filename = await createTest(body.spreadsheet)
    await sendFileCreated({ filename })

    await submissionReceiver.completeMessage(msg)
  } catch (err) {
    console.error('Unable to process message')
    console.error(err)
    await submissionReceiver.abandonMessage(msg)
  }
}
