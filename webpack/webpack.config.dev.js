const path = require('path')
const { resolve } = path
const OpenBrowserPlugin = require('open-browser-webpack-plugin')

const port = 3108

const templateHtml = function () {
  if (process.env.ENV === 'loc') {
    return new HtmlWebpackPlugin({
      title: '图床',
      multihtmlCatch: true,
      template: path.join(__dirname, '../src/index.html')
    })
  }
  return new HtmlWebpackPluginProduction({
    filename: 'index.html',
    favicon: 'src/assets/favicon.ico',
    showErrors: true,
    CDN_BASE: CDN_BASE,
    publicPath: publicPath,
    W_ENV: process.env.ENV,
    hash: true,
    template: path.join(__dirname, 'src/index.html')
  })
}

module.exports = {
  entry: resolve(__dirname, '../src/index.js'),
  watch: true,
  watchOptions: {
    // 只有开启监听模式watchOptions才有意义
    ignored: /node_modules/, // 不监听的文件或者文件夹，默认为空，支持正则匹配。
    // 监听到变化发生后，会等300ms再去执行更新，默认是300ms
    aggregateTimeout: 300,
    poll: 1000, // 判断文件是否发生变化，是通过不停的询问系统指定文件有没有发生变化实现的，默认每秒问1000次。
  },
  plugins: [
    new OpenBrowserPlugin({ url: `http://localhost:${port}` }),
    new HtmlWebpackPluginProduction({
      filename: 'index.html',
      favicon: 'src/assets/favicon.ico',
      showErrors: true,
      CDN_BASE: CDN_BASE,
      publicPath: publicPath,
      W_ENV: process.env.ENV,
      hash: true,
      template: path.join(__dirname, 'src/index.html')
    })
  ],
  devServer: {
    historyApiFallback: true, //不跳转
    noInfo: true,
    inline: true, // 实时刷新
    port, // 不指定固定端口
    hot: true,
    host: '0.0.0.0',
  },
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, '../dist')
  },
  mode: 'development',
}