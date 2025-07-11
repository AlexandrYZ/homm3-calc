const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

/**
 * Важно: HtmlWebpackPlugin будет копировать index.html в dist,
 * devServer будет раздавать dist, чтобы не было 404.
 */

module.exports = {
	stats: 'errors-only',
	infrastructureLogging: { level: 'error' },
	entry: './src/app.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	mode: isDev ? 'development' : 'production',
	...(isDev ? {
		watch: true,
		devServer: {
			static: './dist', // теперь сервер раздаёт dist
			hot: true,
			client: {
				logging: 'error',
				overlay: {
					warnings: false,
					errors: true
				}
			}
		}
	} : {}),
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: [
            'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass'),
              },
            },
          ]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './index.html', // копировать index.html в dist
		}),
		new CopyPlugin({
			patterns: [
				{ from: 'img', to: 'img' }
			]
		})
	]
};
