const ExcelJS = require('exceljs')
const { sendFileCreated } = require('./senders')
const appInsights = require('../services/app-insights')
const { blobContainerClient } = require('../services/blob-storage')

async function addWorksheet (workbook, worksheetData) {
  const worksheet = workbook.addWorksheet(worksheetData.title)
  console.log(worksheet.properties)
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

async function createSpreadsheet (spreadsheetData) {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'ffc-grants-file-creation'
  workbook.created = new Date()

  for (const worksheet of spreadsheetData.worksheets) {
    await addWorksheet(workbook, worksheet)
  }

  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}

async function uploadSpreadsheet (buffer, filename) {
  const blockBlobClient = blobContainerClient.getBlockBlobClient(filename)

  // Upload data to the blob
  const uploadBlobResponse = await blockBlobClient.upload(buffer, buffer.byteLength)
  console.log('Blob was uploaded successfully')
  console.log(uploadBlobResponse)
}

module.exports = async function (msg, submissionReceiver) {
  try {
    const { body } = msg
    console.log('Received message:')
    console.log(JSON.stringify(body, null, 2))

    const spreadSheetBuffer = await createSpreadsheet(body.spreadsheet)

    const filename = body.spreadsheet.filename
    await uploadSpreadsheet(spreadSheetBuffer, filename)

    await sendFileCreated({ filename, uploadLocation: body.spreadsheet.uploadLocation })

    await submissionReceiver.completeMessage(msg)
  } catch (err) {
    appInsights.logException(err, msg?.correlationId)
    await submissionReceiver.abandonMessage(msg)
    console.error('Unable to process message')
    console.error(err)
  }
}
