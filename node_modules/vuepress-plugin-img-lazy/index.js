const path = require('path')

module.exports = (options, ctx) => {
  const selector = options && options.selector ? options.selector : 'lazy'
  const rootMargin = options && options.rootMargin ? options.rootMargin : '200px'
  const useNative = options && typeof options.useNative === 'boolean'
    ? options.useNative
    : options && typeof options.useLoading === 'boolean'
      ? options.useLoading
      : true
  const prefix = options && options.prefix
    ? options.prefix
    : src => src && src.charAt(0) === '/' && !src.startsWith(ctx.base)
      ? ctx.base + src.slice(1)
      : src

  return {
    name: 'vuepress-plugin-img-lazy',

    chainWebpack: config => {
      config.module
        .rule('vue')
        .test(/\.vue$/)
        .use('vue-loader')
        .loader('vue-loader')
        .options({ transformAssetUrls: {
          video: ['src', 'poster'],
          source: 'src',
          img: ['src', 'data-src'],
          image: ['xlink:href', 'href'],
          use: ['xlink:href', 'href']
        }})
    },

    extendMarkdown: md => {
      md.use(require('markdown-it-img-lazy'), { useNative, selector, prefix })
      md.use(require('markdown-it-imsize'))
    },

    async clientDynamicModules () {
      return [{
        name: 'imgLazy.js',
        content: `export default ${JSON.stringify({ useNative, selector, rootMargin })}`
      }]
    },

    enhanceAppFiles: path.resolve(__dirname, 'enhanceAppFile.js')
  }
}
