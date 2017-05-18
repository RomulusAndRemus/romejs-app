const path = require('path');
const webpack = require('webpack');
 
module.exports = {
  entry: './app/src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, './build'),
    publicPath: '/build/'
  },
  target: 'electron',
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      },
    ]
  },
};
