const path = require('path')
const config = require('./config')
const plugins = require('./plugins')
const moduleConfig = require('./module')

const ENV = process.env.ENV
const distPath = path.resolve(__dirname, '../dist')

module.exports = {
  plugins: plugins(ENV, config, distPath),
  watchOptions: config.watchOptions(),
  watch: config.watch(ENV),
  module: moduleConfig(ENV),
  devtool: config.devtool(ENV),
  entry: path.resolve(__dirname, '../src/index.js'),
  devServer: {
    hot: true,
    inline: true,
    hotOnly: true,
    compress: true,
    port: config.port,
    contentBase: distPath,
  },
  output: {
    filename: '[name].[hash].bundle.js',
    path: distPath,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
    extensions: ['*', '.js', '.vue', '.json'],
  },
  optimization: config.optimization(ENV),
  mode: config.mode(ENV),
}