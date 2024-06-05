import SilexCms from './js/silex-cms/client.js'
import onboarding from './js/client-plugins/onboarding.js'
import filters from './js/client-filters.js'
import blocks from './js/client-blocks.js'

// This file is loaded by Silex when the user opens the editor
// Its path is set in the environment variable SILEX_CLIENT_CONFIG in index.js
import websiteInfoPlugin from './plugins/client/website-info.js'

export default async function (config) {
    config.addPlugin(websiteInfoPlugin, {})
    config.addPlugin(onboarding, {})
    config.addPublicationTransformers({
        transformPermalink: (path, type) => {
            // Replace /index.html with /
            return type === 'html' && path.endsWith('/index.html') ? path.replace(/index\.html$/, '') : path
        },
        transformPermalink(path, type) {
            // Make absolute paths relative
            switch (type) {
                case 'css':
                    return path.startsWith('/') ? `.${path}` : path
                case 'asset':
                    return path.startsWith('/') ? `.${path}` : path
            }
            return path
        },
    })
    // CMS Plugin
    config.addPlugin(SilexCms, {
        dataSources: [],
        imagePlugin: false,
        i18nPlugin: true,
        fetchPlugin: { duration: '5s' },
        // cacheBuster: true,
        filters: [
            'generic',
            'liquid',
            ...filters(config),
        ],
    })
    config.addPlugin(blocks)
    return {}
}
