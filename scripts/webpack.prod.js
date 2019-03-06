const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpack = require('./webpack.base')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { styleLoaders } = require('./tools')
const path = require('path')

module.exports = merge(baseWebpack, {
  module: {
    rules: styleLoaders({ extract: true, sourceMap: true })
  },
  devtool: false,
  plugins: [
    new CleanWebpackPlugin(['build'], {
      root: path.resolve(__dirname , '..')
    }),
    new CopyPlugin([
      {
        from: 'scripts/manifest/*.json',
        to: './',
        flatten: true
      },
    ]),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new ExtractTextPlugin({
      filename: 'css/[name].[contenthash].css'
    }),
    new webpack.HashedModuleIdsPlugin()
  ]
})
