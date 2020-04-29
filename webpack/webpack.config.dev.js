const path = require('path')
const webpack = require('webpack')
const config = require('./config')
const moduleConfig = require('./module')
const htmlWebpackPlugin = require('html-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');//打包内容分析

const templateHtmlPlugin = function () {
  return new htmlWebpackPlugin({
    filename: 'index.html',
    title: '图床',
    showErrors: true,
    publicPath: config.publicPath,
    template: path.join(__dirname, '../src/index.html')
  })
}

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  watch: config.watch(process.env.ENV),
  devtool: process.env.ENV !== 'loc' ? false : 'cheap',
  watchOptions: config.watchOptions(),
  plugins: [
    new ProgressBarPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new BundleAnalyzerPlugin({ analyzerPort: 8919 }),
    templateHtmlPlugin(),
  ],
  module: moduleConfig(process.env.ENV),
  devServer: {
    hot: true,
    hotOnly: true,
    port: config.port,
    contentBase: path.resolve(__dirname, '../dist/'),
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },
  mode: config.mode(process.env.ENV),
}