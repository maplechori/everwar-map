const path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
      entry: './src/index.js',
      mode: 'production',
      output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
      },
      plugins: [
      ]
};
