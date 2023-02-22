const { path } = require('@vuepress/shared-utils')

module.exports = (options = {}, ctx) => ({
    define: {
        selector: options.selector || 'div[class*="language-"] pre',
        align: options.align || 'bottom',
        color: options.color || '#27b1ff',
        backgroundColor: options.backgroundColor || '#0075b8',
        backgroundTransition: options.backgroundTransition !== false,
        successText: options.successText || 'Copied!',
        staticIcon: options.staticIcon === true

    },
    enhanceAppFiles: [path.resolve(__dirname, 'appFile.js')],
    clientRootMixin: path.resolve(__dirname, 'clientRootMixin.js')
})
