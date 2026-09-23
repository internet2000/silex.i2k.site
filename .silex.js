// Silex 3.9+ loads this file (SILEX_SERVER_CONFIG) BEFORE its own default config
// (node_modules/@silexlabs/silex/server/deploy/.silex.js), which already serves the
// editor, the dashboard and the onboarding backend, and sets connectors from env vars.
// Here we only add the i2k client plugins and force the i2k connectors.
const { ServerEvent } = require('@silexlabs/silex/dist/server/server/events')
const GitlabConnector = require('@silexlabs/silex/dist/server/server/plugins/GitlabConnector').default
const GitlabHostingConnector = require('@silexlabs/silex/dist/server/server/plugins/GitlabHostingConnector').default
const StaticPlugin = require('@silexlabs/silex/dist/server/server/plugins/StaticPlugin').default

module.exports = async function (config) {
  // The default config (loaded after this file) resets the connectors from env vars
  // => set the i2k ones at startup, once every config file is loaded
  config.on(ServerEvent.STARTUP_START, () => initConnectors(config))

  await config.addPlugin(StaticPlugin, {
    routes: [
      {
        route: '/js/client-plugins/',
        path: './client-plugins/',
      }, {
        route: '/js/client-plugins/lit-html/',
        path: 'node_modules/lit-html/',
      },
    ],
  })
}

const env = {
  GITLAB_CLIENT_ID: process.env.GITLAB_CLIENT_ID,
  GITLAB_CLIENT_SECRET: process.env.GITLAB_CLIENT_SECRET,
  GITLAB_DOMAIN: process.env.GITLAB_DOMAIN,
}

// Create alternate versions of the the Gitlab connector
class GitlabConnector1 extends GitlabConnector {
  displayName = 'Internet 2000'
  icon = 'https://internet2000.net/cms/assets/362020c9-10d9-40db-8a92-0d4f96bd886b.png'
  constructor(config, options) {
    super(config, options)
  }
}

class GitlabHostingConnector1 extends GitlabHostingConnector {
  displayName = 'Internet 2000'
  icon = 'https://internet2000.net/cms/assets/362020c9-10d9-40db-8a92-0d4f96bd886b.png'
  constructor(config, options) {
    super(config, options)
  }
}

function initConnectors(config) {
  config.setStorageConnectors([
    new GitlabConnector1(config, {
      clientId: env.GITLAB_CLIENT_ID,
      clientSecret: env.GITLAB_CLIENT_SECRET,
      domain: env.GITLAB_DOMAIN,
    })
  ])

  config.setHostingConnectors([
    new GitlabHostingConnector1(config, {
      clientId: env.GITLAB_CLIENT_ID,
      clientSecret: env.GITLAB_CLIENT_SECRET,
      domain: env.GITLAB_DOMAIN,
    })
  ])
}
