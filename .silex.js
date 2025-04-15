const { ConnectorType } = require('@silexlabs/silex/dist/server/types')
const FtpConnector = require('@silexlabs/silex/dist/plugins/server/plugins/server/FtpConnector').default
const DownloadConnector = require('@silexlabs/silex/dist/plugins/server/plugins/server/DownloadConnector').default
const GitlabConnector = require('@silexlabs/silex/dist/plugins/server/plugins/server/GitlabConnector').default
const GitlabHostingConnector = require('@silexlabs/silex/dist/plugins/server/plugins/server/GitlabHostingConnector').default
const dash = require('@silexlabs/silex-dashboard')
const StaticPlugin = require('@silexlabs/silex/dist/plugins/server/plugins/server/StaticPlugin').default

module.exports = async function (config) {
  await config.addPlugin(dash)

  initConnectors(config)

  // CMS Plugin
  config.addPlugin(StaticPlugin, {
    routes: [
      {
        route: '/js/client-plugins/',
        path: './client-plugins/',
      },
      {
        route: '/plugins/',
        path: 'node_modules/@silexlabs/silex/dist/plugins/client/plugins/client/',
      }, {
        route: '/js/client-plugins/lit-html/',
        path: 'node_modules/lit-html/',
      }, {
        // CMS Plugin
        route: '/js/silex-cms/',
        path: 'node_modules/@silexlabs/silex-cms/dist/',
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