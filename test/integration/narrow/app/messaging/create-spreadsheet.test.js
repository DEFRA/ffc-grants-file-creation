
afterEach(() => {
  jest.clearAllMocks()
})
describe('Upload to create spreadsheet tests', () => {
  const mockWriteBuffer = jest.fn(async () => { return {} })
  jest.mock('exceljs', () => {
    return {
      Workbook: jest.fn(() => {
        return {
          creator: 'ffc-grants-file-creation',
          created: new Date(),
          addWorksheet: jest.fn(() => {
            return {
              properties: {
                defaultColWidth: 123
              },
              protect: jest.fn(async (password) => { return null }),
              getRow: jest.fn(() => {
                return {
                  values: jest.fn(() => { return null }),
                  font: jest.fn(() => { return null })
                }
              })
            }
          }),
          xlsx: {
            writeBuffer: mockWriteBuffer
          }
        }
      })
    }
  })

  const mockUploadFile = jest.fn(async () => { return null })
  jest.mock('../../../../../app/services/blob-storage', () => {
    return {
      uploadFile: mockUploadFile
    }
  })

  const mockSendFileCreated = jest.fn(async (message) => { return null })
  jest.mock('../../../../../app/messaging/senders', () => {
    return {
      sendFileCreated: mockSendFileCreated
    }
  })

  const appInsights = require('../../../../../app/services/app-insights')
  appInsights.logException = jest.fn((_err, _sessionId) => { })
  const submissionReceiver = {
    completeMessage: jest.fn(async (message) => { return null }),
    abandonMessage: jest.fn(async (message) => { return null })
  }

  test('Should not throw error', () => {
    const createSpreadsheet = require('../../../../../app/messaging/create-spreadsheet')
    expect(createSpreadsheet('', submissionReceiver)).toBeDefined()
  })

  test('Should run successfully - ..AND create a file, AND upload it, AND send it!', async () => {
    const createSpreadsheet = require('../../../../../app/messaging/create-spreadsheet')
    await createSpreadsheet({
      correlationId: '12341234',
      body: {
        spreadsheet: {
          filename: 'test.xlsx',
          worksheets: [
            {
              title: '',
              defaultColumnWidth: 123,
              protectPassword: '123123',
              rows: [
                { row: {} }
              ],
              hideEmptyRows: null
            }
          ]
        }
      }
    }, submissionReceiver);

    expect(mockWriteBuffer).toHaveBeenCalledTimes(1) // creates the file
    expect(mockUploadFile).toHaveBeenCalledTimes(1) // uploads the file
    expect(submissionReceiver.completeMessage).toHaveBeenCalledTimes(1) // completes the message
    expect(mockSendFileCreated).toHaveBeenCalledTimes(1) // sends the message
  })

  test('Should run successfully - Without defaultColumnWidth', async () => {
    const createSpreadsheet = require('../../../../../app/messaging/create-spreadsheet')
    await createSpreadsheet({
      correlationId: '12341234',
      body: {
        spreadsheet: {
          filename: 'test.xlsx',
          worksheets: [
            {
              title: '',
              defaultColumnWidth: null,
              protectPassword: '123123',
              rows: [
                { row: {} }
              ],
              hideEmptyRows: null
            }
          ]
        }
      }
    }, submissionReceiver);

    expect(mockWriteBuffer).toHaveBeenCalledTimes(1) // creates the file
    expect(mockUploadFile).toHaveBeenCalledTimes(1) // uploads the file
    expect(submissionReceiver.completeMessage).toHaveBeenCalledTimes(1) // completes the message
    expect(mockSendFileCreated).toHaveBeenCalledTimes(1) // sends the message
  })

  test('Should run successfully - AND hide empty rows', async () => {
    const createSpreadsheet = require('../../../../../app/messaging/create-spreadsheet')
    await createSpreadsheet({
      correlationId: '12341234',
      body: {
        spreadsheet: {
          filename: 'test.xlsx',
          worksheets: [
            {
              title: '',
              defaultColumnWidth: null,
              protectPassword: '123123',
              rows: [
                { row: {} }
              ],
              hideEmptyRows: true
            }
          ]
        }
      }
    }, submissionReceiver);

    expect(mockWriteBuffer).toHaveBeenCalledTimes(1) // creates the file
    expect(mockUploadFile).toHaveBeenCalledTimes(1) // uploads the file
    expect(submissionReceiver.completeMessage).toHaveBeenCalledTimes(1) // completes the message
    expect(mockSendFileCreated).toHaveBeenCalledTimes(1) // sends the message
  })

  test('Should throw error and call abandonMessage', async () => { // this one's actually ok!
    const createSpreadsheet = require('../../../../../app/messaging/create-spreadsheet')
    await expect(createSpreadsheet('', submissionReceiver)).rejected
    expect(appInsights.logException).toHaveBeenCalledTimes(1)
    expect(submissionReceiver.abandonMessage).toHaveBeenCalledTimes(1)
  })
})
