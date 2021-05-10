jest.mock('ffc-messaging')
const ffcMessaging = require('ffc-messaging')
ffcMessaging.MessageSender = jest.fn().mockImplementation(() => {
  return {
    closeConnection: jest.fn(),
    sendMessage: jest.fn(async (message) => {})
  }
})
ffcMessaging.MessageReceiver = jest.fn().mockImplementation((queue, updateAction) => {
  return {
    closeConnection: jest.fn(),
    subscribe: jest.fn()
  }
})
describe('messaging tests', () => {
  test('Senders Should be defined', () => {
    const senders = require('../../../../../app/messaging/senders')
    expect(senders).toBeDefined()
  })
  test('Senders sendFileCreated Should not throw error', async () => {
    const senders = require('../../../../../app/messaging/senders')
    await expect(senders.sendFileCreated('', '')).resolves.not.toThrow()
  })
  test('Receiver Should be defined', () => {
    const receivers = require('../../../../../app/messaging/receivers')
    expect(receivers).toBeDefined()
  })
  test('Receiver startSubmissionReceiver Should not throw error', async () => {
    const receivers = require('../../../../../app/messaging/receivers')
    await expect(receivers.startSubmissionReceiver('')).resolves.not.toThrow()
  })
})
