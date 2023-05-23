// Mocks
jest.mock('../../../../app/server')
jest.mock('../../../../app/messaging/receivers')
jest.mock('../../../../app/messaging/create-spreadsheet', () => ({
    hideEmptyRows: true,
    protectEnabled: true,
    sendEmailToRpa: true,
    protectPassword: mockPassword
}))
jest.mock('../../../../app/services/app-insights')

const receivers = require('../../../../app/messaging/receivers')
const mockPassword = 'mock-pwd'
const mockStartSubmissionReceiver = jest.fn((d) => null)
receivers.startProjectDetailsReceiver = jest.fn((a) => null)
receivers.startContactDetailsReceiver = jest.fn((b) => null)
receivers.startDesirabilityScoreReceiver = jest.fn((c) => null)
receivers.startSubmissionReceiver = mockStartSubmissionReceiver

// Spies
const server = require('../../../../app/server')
const mockStartSpy = jest.spyOn(server, 'start').mockImplementation(async () => {
    console.log('Mock: Server running on %s', server.info.uri)
})
const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { return null })
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { return null })

describe('Index', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('Should call server.start', async () => {
        require('../../../../app/index')
        expect(mockStartSubmissionReceiver).toHaveBeenCalledTimes(1)
        expect(mockStartSpy).toHaveBeenCalledTimes(1)
        expect(logSpy).toHaveBeenCalledWith('Mock: Server running on %s', server.info.uri)
    })

    it('Should exit on unhandledRejection', async () => {
        process.emit('unhandledRejection')
        expect(mockExit).toHaveBeenCalledWith(1)
    })
})

