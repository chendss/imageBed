const path = require('path')

module.exports = {
  port: 6629,
  publicPath: './',
  devtool (env) {
    return env === 'loc' ? 'cheap-module-source-map' : false
  },
  watch (env) {
    return env === 'loc'
  },
  watchOptions () {
    return {
      // 只有开启监听模式watchOptions才有意义
      ignored: /node_modules/, // 不监听的文件或者文件夹，默认为空，支持正则匹配。
      // 监听到变化发生后，会等300ms再去执行更新，默认是300ms
      aggregateTimeout: 300,
      poll: 1000, // 判断文件是否发生变化，是通过不停的询问系统指定文件有没有发生变化实现的，默认每秒问1000次。
    }
  },
  mode (env) {
    return env === 'loc' ? 'development' : 'production'
  },
  optimization (env) {
    if (env === 'prod') {
      return {
        concatenateModules: true,
        splitChunks: {
          chunks: 'all',
        },
        usedExports: true
      }
    }
    return null
  }
}