const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
module.exports = {
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
  },
  configureWebpack: {
    plugins:
      process.env.NODE_ENV === 'production' ? [new BundleAnalyzerPlugin()] : [],
    externals:
      process.env.NODE_ENV === 'production' ? { vue: 'Vue', vuex: 'Vuex' } : {},
  },
}
