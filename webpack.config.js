const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
  entry: [`./src/js/script.js`, `./src/css/style.css`],

  output: {
    path: path.resolve(__dirname, `dist`),
    filename: `js/[name].js`
  },

  module: {
    rules:[
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ]
  },

  plugins:
    [
      new ExtractTextPlugin("css/style.css"),
    ]

};

module.exports = config;
