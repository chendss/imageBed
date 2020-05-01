const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const cssnano = require('cssnano')
const purifycssWebpack = require('purifycss-webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')//打包内容分析
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

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
  const result = []
  if (env === 'prod') {
    result.push(new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css\.*(?!.*map)/g,  //注意不要写成 /\.css$/g
      cssProcessor: cssnano,
      cssProcessorOptions: {
        discardComments: { removeAll: true },
        safe: true,
        autoprefixer: false
      },
      canPrint: true
    }))
    result.push(new miniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }))
  }
  return result
}

/**
 * 处理没有用到的css
 *
 * @param {*} env
 */
const purifycss = function (env, distPath) {
  if (env === 'prod') {
    return [new purifycssWebpack({
      paths: glob.sync(distPath)
    })]
  }
  return []
}

const copyAction = function (env, distPath) {
  let result = [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/static'),
        to: distPath + '/static'
      },
      {
        from: path.resolve(__dirname, '../src/css'),
        to: distPath + '/css'
      },
    ])
  ]
  return result
}

module.exports = function (env, config, distPath) {
  const result = [
    ...cssOptPlugin(env),
    new ProgressBarPlugin(),
    templateHtmlPlugin(config),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
      generateStatsFile: true, // 是否生成stats.json文件 }),
    }),
    new friendlyErrorsWebpackPlugin(),
    ...purifycss(env, distPath),
    ...copyAction(env, distPath)
  ]
  return result
}