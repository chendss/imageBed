const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const cssLoader = function (env) {
  if (env === 'prod') {
    return ['style-loader']
  }
  return [MiniCssExtractPlugin.loader]
}

const styleLoader = function (env) {
  return [
    {
      test: /\.scss|scss|css$/,
      exclude: /node_modules/,
      use: [
        ...cssLoader(env),
        'style-loader',
        'fast-css-loader',
        'fast-sass-loader',
      ]
    },
    {
      test: /\.(less|css)$/,
      exclude: /node_modules/,
      use: [
        ...cssLoader(env),
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