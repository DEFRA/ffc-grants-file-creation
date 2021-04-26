const sharedConfig = {
  appInsights: require('applicationinsights'),
  host: process.env.SERVICE_BUS_HOST,
  password: process.env.SERVICE_BUS_PASSWORD,
  username: process.env.SERVICE_BUS_USER,
  useCredentialChain: process.env.NODE_ENV === 'production'
}

module.exports = {
  submissionSubscription: {
    address: process.env.DESIRABILITY_SUBMITTED_SUBSCRIPTION_ADDRESS,
    topic: process.env.DESIRABILITY_SUBMITTED_TOPIC_ADDRESS,
    type: 'subscription',
    ...sharedConfig
  },
  fileCreatedTopic: {
    address: process.env.FILE_CREATED_TOPIC_ADDRESS,
    type: 'topic',
    ...sharedConfig
  },
  fileCreatedMsgType: 'uk.gov.ffc.grants.file.created',
  msgSrc: 'ffc-grants-file-creation',
  appInsights: {
    key: process.env.APPINSIGHTS_INSTRUMENTATIONKEY,
    role: process.env.APPINSIGHTS_CLOUDROLE | 'ffc-grants-file-creation'
  }
}
