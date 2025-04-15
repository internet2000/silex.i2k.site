import SilexCms from './js/silex-cms/client.js'
import filters from './js/client-plugins/client-filters.js'
import blocks from './js/client-plugins/client-blocks.js'

// This file is loaded by Silex when the user opens the editor
// Its path is set in the environment variable SILEX_CLIENT_CONFIG in index.js
import websiteInfoPlugin from './plugins/client/website-info.js'

export default async function (config) {
    config.addPlugin(websiteInfoPlugin, {})
    config.addPublicationTransformers({
        transformPermalink: (path, type) => {
            // Replace /index.html with /
            return type === 'html' && path.endsWith('/index.html') ? path.replace(/index\.html$/, '') : path
        },
        //transformPermalink(path, type) {
        //    // Make absolute paths relative
        //    switch (type) {
        //        case 'css':
        //            return path.startsWith('/') ? `.${path}` : path
        //        case 'asset':
        //            return path.startsWith('/') ? `.${path}` : path
        //    }
        //    return path
        //},
    })
    // CMS Plugin
    config.addPlugin(SilexCms, {
        dataSources: [],
        i18nPlugin: true,
        fetchPlugin: false,
        cacheBuster: true,
        filters: [
            'generic',
            'liquid',
            ...filters(config),
        ],
    })
    config.addPlugin(blocks)
    return {}
}
