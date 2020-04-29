module.exports = function () {
  return {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: [
          'style-loader',
          'fast-css-loader',
          'fast-sass-loader',
        ]
      },
    ]
  }
}