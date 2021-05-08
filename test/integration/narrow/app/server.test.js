describe('Server test', () => {
  const { setup } = require('../../../../app/services/app-insights')
  jest.mock('../../../../app/services/app-insights')
  test('createServer returns server', () => {
    const server = require('../../../../app/server')
    expect(server).toBeDefined()
    expect(setup).toHaveBeenCalledTimes(1)
  })
})
