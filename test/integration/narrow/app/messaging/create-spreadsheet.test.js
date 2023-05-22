// const blobStorage = require('../../../../../app/services/blob-storage')
afterEach(() => {
  jest.clearAllMocks()
})
describe('Upload to create spreadsheet tests', () => {
  const mockWriteBuffer = jest.fn(async () => { return {} })
  // proberly mock exceljs!
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

  // mock blob storage
  const mockUploadFile = jest.fn(async () => {
    console.log('A7a: ', '!!!!!!!!!!!!!!!!!!!!!');
    return null
  })

  jest.mock('../../../../../app/services/blob-storage', () => {
    return {
      uploadFile: mockUploadFile
    }
  })
  // jest.mock('../../../../../app/config/blob-storage')


  const mockSendFileCreated = jest.fn(async (message) => {
    console.log('here: ', '!!!!!!!!!!!!!!!!!!!!!');
    return null
  })

  jest.mock('../../../../../app/messaging/senders', () => {
    return {
      sendFileCreated: jest.fn(async (message) => {
        mockSendFileCreated(message)
        return null
      })
    }
  })

  const appInsights = require('../../../../../app/services/app-insights')
  appInsights.logException = jest.fn((_err, _sessionId) => { })
  const submissionReceiver = {
    completeMessage: jest.fn(async (message) => { return null }),
    abandonMessage: jest.fn(async (message) => { return null })
  }

  test('Should be defined', () => {
    const createSpreadsheet = require('../../../../../app/messaging/create-spreadsheet')
    expect(createSpreadsheet).toBeDefined()
  })

  test('Should not throw error', () => {
    const createSpreadsheet = require('../../../../../app/messaging/create-spreadsheet')
    expect(createSpreadsheet('', submissionReceiver)).toBeDefined()
  })

  test.only('Should run successfully - ..AND create a file!', async () => {
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

  test('Should throw error call abandonMessage', async () => {
    const createSpreadsheet = require('../../../../../app/messaging/create-spreadsheet')
    await expect(createSpreadsheet('', submissionReceiver)).rejected
    expect(appInsights.logException).toHaveBeenCalledTimes(1)
    expect(submissionReceiver.abandonMessage).toHaveBeenCalledTimes(1)
  })

  it('Should run successfully -with default column width', async () => {
    const createSpreadsheet = require('../../../../../app/messaging/create-spreadsheet')
    await expect(createSpreadsheet({
      correlationId: '12341234',
      body: {
        spreadsheet: {
          worksheets: [
            {
              title: '',
              protectPassword: '123123',
              rows: [
                { row: {} }
              ],
              hideEmptyRows: null
            }
          ]
        }
      }
    }, submissionReceiver)).resolves.toBe(undefined)
    expect(mockSendFileCreated).toHaveBeenCalledTimes(1)
  })

  it('Should run successfully - and create a spreadsheet WITHOUT a protected password', async () => {
    const createSpreadsheet = require('../../../../../app/messaging/create-spreadsheet')
    await expect(createSpreadsheet({
      correlationId: '12341234',
      body: {
        spreadsheet: {
          worksheets: [
            {
              title: '',
              rows: [
                { row: {} }
              ],
              hideEmptyRows: null
            }
          ]
        }
      }
    }, submissionReceiver)).resolves.toBe(undefined)
    expect(mockSendFileCreated).toHaveBeenCalledTimes(1)
  })

})
