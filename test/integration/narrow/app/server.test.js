
const config = require('../../../../app/config/messaging')

describe('Server test', () => {
  config.appInsights = {
    key: 'mock-key'
  }
  config.submissionSubscription = {
    appInsights: {
      role: 'mock-role'
    }
  }
  const mockStart = jest.fn().mockImplementation(() => { return null })
  const mockSetup = jest.fn().mockImplementation(() => {
    return {
      start: () => mockStart()
    }
  })
  const mockDefaultClient = {
    context: {
      keys: {
        cloudRole: 'cloudRole'
      },
      tags: {
        cloudRole: 'empty!'
      }
    }
  }

  jest.mock('applicationinsights', () => ({
    setup: mockSetup,
    defaultClient: mockDefaultClient
  }))

  afterEach(() => {
    jest.clearAllMocks()
  })
  test('Returns a server - AND runs app insights if config is present', () => {
    const server = require('../../../../app/server') // jest importing the module will run app-insights setup!
    expect(server).toBeDefined()

    expect(mockSetup).toHaveBeenCalledTimes(1)
    expect(mockStart).toHaveBeenCalledTimes(1)
    expect(mockDefaultClient.context.tags.cloudRole).toBe('mock-role')
  })

  test('Returns a server - with no config app-insights WILL NOT run', () => {
    config.appInsights = null
    mockDefaultClient.context.tags.cloudRole = 'empty!' // reset the mock
    const server = require('../../../../app/server') // jest importing the module will run app-insights setup!
    expect(server).toBeDefined()

    expect(mockSetup).toHaveBeenCalledTimes(0)
    expect(mockStart).toHaveBeenCalledTimes(0)
    expect(mockDefaultClient.context.tags.cloudRole).toBe('empty!')
  })
})
