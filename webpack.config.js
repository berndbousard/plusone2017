const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //Extract static CSS file
const HtmlWebpackPlugin = require('html-webpack-plugin'); //Inject JS into index.html

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
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader'
          ]
        }),
      }
    ]
  },

  plugins:
    [
      new ExtractTextPlugin("css/style.css"),
      new HtmlWebpackPlugin({
        title: `PlusOne Amsterdam`
      }),
    ]

};

module.exports = config;
