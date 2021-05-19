describe('BlobStorage config', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  test('Valid env var pass validation', () => {
    const mockKey = 'mock-key'
    process.env.BLOB_STORAGE_CONNECTION_STRING = mockKey
    const BlobStorageConfig = require('../../../../../app/config/blob-storage')
    expect(BlobStorageConfig.connectionStr).toBe(mockKey)
  })

  test('Invalid env var throws error', () => {
    process.env.BLOB_STORAGE_CONNECTION_STRING = null
    expect(() => require('../../../../../app/config/blob-storage')).toThrow()
  })
})
