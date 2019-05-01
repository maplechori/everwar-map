const path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
      entry: './src/index.js',
      mode: 'production',
      output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
      },
       module: {
         rules: [
         {
           test: /\.(js|jsx)$/,
           exclude: /node_modules/,
           use: {
              loader: "babel-loader"
           }
         }
        ]
      },

      plugins: [
      ]
};
