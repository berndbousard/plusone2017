const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin'); //Extract static CSS file

const HtmlWebpackPlugin = require('html-webpack-plugin'); //Inject JS into index.html
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
	template: './src/index.html', //Use src index.html as the template
	filename: 'index.html',
	title: 'PlusOne Amsterdam',
	inject: 'body' //Inject JS before body tag
});

const config = {
	entry: [path.resolve('src/js/script.js'), path.resolve('src/css/style.css')],

	output: {
		path: path.resolve('dist'),
		filename: 'js/[name].js'
	},

	devServer: {
		historyApiFallback: true
	},

	resolve: {
    extensions: [
      `.js`,
      `.jsx`,
      `.css`
    ]
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
			},

			{
				test: /\.(js|jsx?)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader'
					}
				]
			},
		]
	},

	plugins:
				[
					new ExtractTextPlugin('css/style.css'),
					HtmlWebpackPluginConfig
				]
};


module.exports = config;
