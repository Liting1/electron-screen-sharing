const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDevMode = process.env.NODE_ENV === 'development';
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { params } = require('./common.config');
const { version } = require('../config/version');

// 获取渲染线程下的所有页面
const filePath ='./src/renderer/';
let files = fs.readdirSync(filePath)
let win = files.filter(page => fs.lstatSync(filePath+page).isDirectory())

// 获取打包多页面入口
function getEnter(win){
	return win.reduce((a, page)=>({
		...a, 
		[page]: path.join(__dirname, `../src/renderer/${page}/index.js`)
	}), {});
}

// 获取打包多页面模板文件
function pageTemplate(win){
	return win.map(page => new HtmlWebpackPlugin({
		template: `./src/renderer/${page}/index.html`,
		filename: `./${page}.html`,
		chunks: ['common', page],
		hash: true,
	}))
}

module.exports = {
	mode: isDevMode ? 'development': 'production',
	entry: getEnter(win),
	output: {
		path: path.join(__dirname, '../app/'),
		publicPath: isDevMode ? '/': '',
		filename: 'js/[name].[contenthash].js',
		chunkFilename: 'js/[name].bundle.js',
	},
	module: {
		rules: [{
			test: /\.vue$/,
			loader: 'vue-loader'
		}, { // 配置sass语法支持，并且使用的是缩进格式
			test: /\.s[ac]ss$/,
			use: [
				...(
					isDevMode 
					? ['vue-style-loader', 'style-loader'] 
					: [MiniCssExtractPlugin.loader]
				),
				'css-loader',
				{
					loader: 'sass-loader',
					options: {
						sassOptions: {
				        	indentedSyntax: true // 如需使用花括号嵌套模式则设置为false
				        }
					}
				}
			]
		}, { // 配置支持css支持
			test: /\.css(\?.*)?$/,
			use: [
				...(
					isDevMode 
					? ['vue-style-loader', 'style-loader'] 
					: [MiniCssExtractPlugin.loader]
				),
				'css-loader'
			]
		}, { // 配置Babel将ES6+ 转换为ES5
			test: /\.js(\?.*)?$/,
			exclude: file => ( // 排除node_modules文件夹
				/node_modules/.test(file) &&
				!/\.vue\.js/.test(file)
			),
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env'],
					plugins: ['@babel/plugin-transform-runtime']
				}
			}
		}, { // 配置图片文件加载
			test: /\.(png|jpe?g|gif|tif?f|bmp|webp|svg)(\?.*)?$/,
			use: {
				loader: 'url-loader',
				options: {
					limit: 10000,
					esModule: false
				}
			}
		}, { // 配置字体文件加载
			test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
			use: {
				loader: 'file-loader',
				options: {
					esModule: false,
					limit: 10000
				}
			}
		}, { // 处理node文件
			test: /\.node$/,
			loader: 'node-loader'
		}]
	},
	node: {
		__dirname: isDevMode,
		__filename: isDevMode,
	},
	resolve: {
		// 引入文件时可以省略文件后缀名
		extensions:['.js','.json','.vue'],
		// 常用路径别名
		alias: {
			'@': path.join(__dirname, '../src/renderer/home/')
		}
	},
	plugins: [
		...pageTemplate(win), // 设置HTML模板
		// new BundleAnalyzerPlugin({ analyzerPort: 8888 }), // chunks 分析插件
		new webpack.optimize.SplitChunksPlugin({
			cacheGroups: {
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true
				},
				// 打包重复出现的代码
				vendor: {
					name: 'vendor',
					chunks: 'initial',
					minChunks: 2,
					maxInitialRequests: 5,
					minSize: 0
				},
				// 打包第三方类库
				commons: {
					name: 'commons',
					chunks: 'initial',
					minChunks: Infinity
				}
			}
		}),
		new CleanWebpackPlugin({ // 清除所有文件，main.js文件除外
			cleanOnceBeforeBuildPatterns: ['**/*', '!main.js*']
		}),
		new VueLoaderPlugin(),		// vue-loader 加载插件
		new MiniCssExtractPlugin({	// css打包成css文件插件
			filename: 'css/[name].css',
			chunkFilename: 'css/[id].css',
		}),
		new CopyPlugin({ // 复制静态文件
			patterns: [{
				// 复制项目中所用到的公告文件
				from: path.join(__dirname, '../src/static'),
				to: path.join(__dirname, '../app/static')
			}, {
				// 复制较小的页面文件
				from: path.join(__dirname, '../src/pages'),
				to: path.join(__dirname, '../app/pages')
			}]
		}),
		new webpack.DefinePlugin({
			VERSION: JSON.stringify(version.join('.')),		// 版本号
			MODE: JSON.stringify(params.mode),				// 运行的环境
			NODE_ENV: JSON.stringify(process.env.NODE_ENV)  // node环境
		})
	],
	target: 'electron-renderer',
}