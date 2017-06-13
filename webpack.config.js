const webpack = require('webpack')
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
  entry: './js/app.js',
  output: {
    filename: './dist/main.js',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        query: {
         cacheDirectory: true,
        }
      },
      {
        test: /\.scss$/,
        loaders: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!sass-loader',
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: './dist/style.css',
      allChunks: true,
    })
  ]
};