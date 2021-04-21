const appInsights = require('applicationinsights')
const config = require('../config/messaging')

function setup () {
  if (config.appInsights.key | config.appInsights) {
    appInsights.setup().start()
    const cloudRoleTag = appInsights.defaultClient.context.keys.cloudRole
    const appName = config.appInsights.role
    appInsights.defaultClient.context.tags[cloudRoleTag] = appName
  }
}

module.exports = { setup }
