const path = require('path');

let config = {
  mode: 'development',
  entry: './src/Index.jsx',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, './dist')
  },
  module: {
    rules: [{
      test: /.(js|jsx)$/,
      use: {
        loader: 'babel-loader'
      },
      exclude: /node_modules/
    }]
  }
};


module.exports = config;