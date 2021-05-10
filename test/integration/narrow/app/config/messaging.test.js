describe('messaging config', () => {
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
    process.env.SERVICE_BUS_HOST = mockKey
    const messagingConfig = require('../../../../../app/config/messaging')
    expect(messagingConfig.submissionSubscription.host).toBe(mockKey)
  })
})
