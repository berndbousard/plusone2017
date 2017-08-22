const path = require(`path`);
const webpack = require(`webpack`);

const ExtractTextPlugin = require(`extract-text-webpack-plugin`); //Extract static CSS file
const {getIfUtils, removeEmpty} = require(`webpack-config-utils`);
const {ifProduction} = getIfUtils(process.env.NODE_ENV);

const HtmlWebpackPlugin = require(`html-webpack-plugin`); //Inject JS into index.html
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
	template: `./src/index.html`, //Use src index.html as the template
	filename: `index.html`,
	title: `PlusOne Amsterdam`,
	inject: `body` //Inject JS before body tag
});

module.exports = {

	//Webpack2 syntax, now it can take arguments
	entry: [path.resolve(`src/js/script.js`), path.resolve(`src/css/style.scss`)],

	output: {
		path: path.resolve(`server/dist`),
		filename: `js/[name].js`,
		publicPath: ``
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
					fallback: `style-loader`,
					use: [
						{ loader: `css-loader`, options: { importLoaders: 1 } },
						`postcss-loader`
					]
				}),
			},

			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					use: [{
						loader: `css-loader`
					}, {
						loader: `sass-loader`
					}],
					fallback: `style-loader`
				}),
			},

			{
				test: /\.(js|jsx?)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: `babel-loader`
					}
				]
			},
		]
	},

	plugins:
				removeEmpty([
					new ExtractTextPlugin(`css/style.css`),
					HtmlWebpackPluginConfig,

					ifProduction(
						new webpack.DefinePlugin({
							'process.env.NODE_ENV': JSON.stringify(`production`)
						})
					),

					ifProduction(
						new webpack.optimize.UglifyJsPlugin({
							beautify: false,
							comments: false,
							compress: {screw_ie8: true},
							mangle: {screw_ie8: true}
						})
					),

					ifProduction(
						new webpack.LoaderOptionsPlugin({
							minimize: true,
							debug: false
						})
					)
				])
};
