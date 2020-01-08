const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const ChromeReloadPlugin = require('wcer')
const baseWebpack = require('./webpack.base')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const { styleLoaders } = require('./tools')

module.exports = merge(baseWebpack, {
  // cheap-module-eval-source-map быстрее для разработки
  watch: true,
  output: {
    path: path.join(__dirname, '..', 'build-dev')
  },
  module: {
    rules: styleLoaders({ sourceMap: false })
  },
  devtool: '#source-map',
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
    new FriendlyErrorsPlugin(),
    new ChromeReloadPlugin({
      port: 9090,
      manifest: path.join(__dirname, '..', 'src', 'manifest.js')
    })
  ]
})
