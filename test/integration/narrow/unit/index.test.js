jest.mock('../../../../app/server')
jest.mock('../../../../app/messaging/receivers')
jest.mock('../../../../app/messaging/create-spreadsheet', () => ({
    hideEmptyRows: true,
    protectEnabled: true,
    sendEmailToRpa: true,
    protectPassword: mockPassword
}))
jest.mock('../../../../app/services/app-insights')
const { setup } = require('../../../../app/services/app-insights')
const server = require('../../../../app/server')
server.start = jest.fn(async () => null)
const receivers = require('../../../../app/messaging/receivers')
const mockPassword = 'mock-pwd'

receivers.startProjectDetailsReceiver = jest.fn((a) => null)
receivers.startContactDetailsReceiver = jest.fn((b) => null)
receivers.startDesirabilityScoreReceiver = jest.fn((c) => null)
const indexInit = require('../../../../app/index')

afterEach(() => {
    jest.clearAllMocks()
})
describe('get indexInit setup defined', () => {
    test('Should be defined', () => {
    expect(indexInit).toBeDefined()
})
    test('Should call setup once', async () => {
    expect(require('../../../../app/index')).toEqual({})
    expect(setup).toHaveBeenCalledTimes(0)
})
})
