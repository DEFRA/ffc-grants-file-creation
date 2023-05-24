jest.mock('ffc-messaging')
const ffcMessaging = require('ffc-messaging')
ffcMessaging.MessageSender = jest.fn().mockImplementation(() => {
  return {
    closeConnection: jest.fn(),
    sendMessage: jest.fn(async (message) => { })
  }
})

const mockCloseConnection = jest.fn().mockImplementation(() => { return null })
const mockSenderCloseConnection = jest.fn().mockImplementation(() => { return null })
const mockSubscribe = jest.fn().mockImplementation(() => { return null })
const mockSendMsg = jest.fn().mockImplementation(() => { return null })
ffcMessaging.MessageReceiver = jest.fn().mockImplementation((queue, updateAction) => {
  return {
    closeConnection: mockCloseConnection,
    subscribe: mockSubscribe,
  }
})
ffcMessaging.MessageSender = jest.fn().mockImplementation(() => {
  return {
    sendMessage: mockSendMsg,
    closeConnection: mockSenderCloseConnection
  }
})

describe('messaging tests: Senders', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Senders Should be defined', () => {
    const senders = require('../../../../../app/messaging/senders')
    expect(senders).toBeDefined()
  })

  test('Senders sendFileCreated - Should call sendMsg', async () => {
    const senders = require('../../../../../app/messaging/senders')
    await expect(senders.sendFileCreated('')).resolves.not.toThrow()
    expect(mockSenderCloseConnection).toHaveBeenCalledTimes(0)
    expect(mockSendMsg).toHaveBeenCalledTimes(1)
  })

  test('Senders startSubmissionReceiver - Should close connection on Should call SIGINT', async () => {
    jest.spyOn(process, 'exit').mockImplementation()

    require('../../../../../app/messaging/senders')

    process.emit('SIGINT');
    expect(mockSendMsg).toHaveBeenCalledTimes(0)
    expect(mockSenderCloseConnection).toHaveBeenCalledTimes(1)
  });

  test('Senders startSubmissionReceiver - Should close connection on Should call SIGTERM', async () => {
    jest.spyOn(process, 'exit').mockImplementation()

    require('../../../../../app/messaging/senders')

    process.emit('SIGTERM');
    expect(mockSendMsg).toHaveBeenCalledTimes(0)
    expect(mockSenderCloseConnection).toHaveBeenCalledTimes(1)
  });
})


describe('messaging tests: Recievers', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  test('Receiver Should be defined', () => {
    const receivers = require('../../../../../app/messaging/receivers')
    expect(receivers).toBeDefined()
  })

  test('Receiver startSubmissionReceiver - Should call subscribe', async () => {
    const receivers = require('../../../../../app/messaging/receivers')
    await expect(receivers.startSubmissionReceiver('')).resolves.not.toThrow()
    expect(mockSubscribe).toHaveBeenCalledTimes(1)
    expect(mockCloseConnection).toHaveBeenCalledTimes(0)
  })

  test('Receiver startSubmissionReceiver - Should close connection on Should call SIGINT', async () => {
    jest.spyOn(process, 'exit').mockImplementation()

    require('../../../../../app/messaging/receivers')

    process.emit('SIGINT');
    expect(mockSubscribe).toHaveBeenCalledTimes(0)
    expect(mockCloseConnection).toHaveBeenCalledTimes(1)
  });

  test('Receiver startSubmissionReceiver - Should close connection on Should call SIGTERM', async () => {
    jest.spyOn(process, 'exit').mockImplementation()

    require('../../../../../app/messaging/receivers')

    process.emit('SIGTERM');
    expect(mockSubscribe).toHaveBeenCalledTimes(0)
    expect(mockCloseConnection).toHaveBeenCalledTimes(1)
  });
})
