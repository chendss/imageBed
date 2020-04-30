const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');//打包内容分析
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const templateHtmlPlugin = function (config) {
  return new htmlWebpackPlugin({
    filename: 'index.html',
    title: '图床',
    showErrors: true,
    publicPath: config.publicPath,
    template: path.join(__dirname, '../src/index.html')
  })
}

const cssOptPlugin = function (env, config) {
  const result = [
    new miniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    })
  ]
  if (env === 'prod') {
    result.push(new OptimizeCssAssetsPlugin({
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    }))
  }
  return result
}

module.exports = function (env, config, distPath) {
  const result = [
    ...cssOptPlugin(),
    new ProgressBarPlugin(),
    templateHtmlPlugin(config),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
      generateStatsFile: true, // 是否生成stats.json文件 }),
    })
  ]
  return result
}