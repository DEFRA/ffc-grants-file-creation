
afterEach(() => {
  jest.clearAllMocks()
})
describe('Upload to create spreadsheet tests', () => {
  jest.mock('exceljs')
  jest.mock('../../../../../app/config/blobStorage')
  jest.mock('../../../../../app/messaging/senders')
  jest.mock('@azure/storage-blob')
  const appInsights = require('../../../../../app/services/app-insights')
  appInsights.logException = jest.fn((_err, _sessionId) => {})
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
  test('Should throw error', async () => {
    const createSpreadsheet = require('../../../../../app/messaging/create-spreadsheet')
    await expect(createSpreadsheet('', null)).rejected
    expect(appInsights.logException).toHaveBeenCalledTimes(1)
  })
})
