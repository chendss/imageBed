const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const extraUse = function (env) {
  let result = []
  if (env === 'prod') {
    result = [MiniCssExtractPlugin.loader]
  }
  return result
}

const styleLoader = function (env) {
  return [
    {
      test: /\.scss|scss|css$/,
      exclude: /node_modules/,
      use: [
        ...extraUse(env),
        'fast-css-loader',
        'fast-sass-loader'
      ]
    },
    {
      test: /\.(less|css)$/,
      exclude: /node_modules/,
      use: [
        ...extraUse(env),
        'fast-css-loader',
        'less-loader'
      ]
    },
  ]
}

module.exports = function (env) {
  return {
    rules: [
      ...styleLoader(env),
    ],
    noParse: /jquery/
  }
}