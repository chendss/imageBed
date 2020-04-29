const styleLoader = function () {
  return [
    {
      test: /\.scss$/,
      exclude: /node_modules/,
      loader: [
        'style-loader',
        'fast-css-loader',
        'fast-sass-loader',
      ]
    },
    {
      test: /\.(less|css)$/,
      loader: [
        'style-loader',
        'fast-css-loader',
        'less-loader'
      ]
    },
  ]
}

module.exports = function () {
  return {
    rules: [
      ...styleLoader(),
    ]
  }
}