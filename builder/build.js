
process.env.NODE_ENV = 'production';
const chalk = require('chalk');
const del = require('del');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const renderConfig = require("./webpack.render.config.js");
const mainRenderConfig = require('./webpack.main.config');
const electronBuilder = require('electron-builder');
const packageJson = require('../package.json');
const archiver = require('archiver');
// 设置 app 一些选项
// 打包渲染进程
// 压缩渲染进程
// 打包主进程
// 打包App


const build = {
	setup: {},
	run(){
		del(['./app/*', './pack/*']);
		// 初始化版本信息
		this.initSetup();
		this.writeVersionConfig();
		this.buildApp();
	},
	initSetup(){
		const setup = require('../config/version.js');
		const runTimeObj = {
			dev: '开发版',
			test: '测试版',
			release: '正式版'
		}
		setup.versionName = runTimeObj.release;
		setup.publishTime = new Date().toLocaleString();
		Object.keys(runTimeObj).forEach(key => {
			if(process.argv.indexOf(key) > 1){
				setup.versionType = key;
				setup.versionName = runTimeObj[key];
			}
		});
		this.runTime(setup.versionType);
		this.setup = setup;
	},
	runTime(val){
		console.log(
			chalk.black.bgYellow('当前环境为：')
			+ chalk.yellow.bgRed.bold(val)
		);
	},
	writeVersionConfig(){
		fs.writeFileSync(path.join(__dirname, '../config/version.js'), `module.exports = ${JSON.stringify(this.setup, null, 4)}`);
		packageJson.version = this.setup.version.slice(0,3).join('.');
		fs.writeFileSync(path.join(__dirname, '../package.json'), JSON.stringify(packageJson,null,4));
	},
	// 创建文件夹，如果文件夹已存在则什么都不做
	async createFolder(outpath){
		return new Promise(resolve => {
			fs.exists(outpath, exists => {
				if(!exists) fs.mkdirSync(outpath);
				resolve(1);
			});
		})
	},
	buildApp(){
		this.viewBuilder().then(async () => {
			let outpath = path.join(__dirname, '../pack/');
			// 创建一个pack目录
			await this.createFolder(outpath);
			let zipPath = renderConfig.output.path;
			let fileName = this.setup.versionType+ '-' + this.setup.version.join('.');
			let filePath = path.join(zipPath, `../pack/${fileName}.zip`);
			this.compress(zipPath, filePath, 7, (type, msg)=>{
				if(type === 'error'){
					return Promise.reject('压缩文件出错：'+ msg);
				} else {
					this.packMain();
					console.log(`压缩包大小为：${(msg/1024/1024).toFixed(2)}MB`);
				}
			});
		}).catch(err=>{
			console.log(err);
			process.exit(1);
		})
	},
	packMain(){
		this.mainBuild().then(()=>{
			electronBuilder.build().then(() => this.openExplorer()).catch(error => {
				console.log(error);
			})
		}).catch(err=>{
			console.log(err);
			process.exit(2);
		})
	},
	compress(filePath, zipPath, level = 9, callback){
		const outpath = fs.createWriteStream(zipPath);
		const archive = archiver('zip', {
			zlib: { level }
		});
		archive.pipe(outpath);
		archive.directory(filePath, false);
		archive.on('error', err => {
			if(callback) callback('error', err);
		});
		outpath.on('close', ()=>{
			let size = archive.pointer();
			if(callback) callback('success', size);
		});
		archive.finalize();
	},
	// 打开文件管理器
	openExplorer() {
		const dirPath = path.join(__dirname, '../pack/');
		if (process.platform === 'darwin') {
			spawn('open', [dirPath]);
		} else if (process.platform === 'win32') {
			spawn('explorer', [dirPath]);
		} else if (process.platform === 'linux') {
			spawn('nautilus', [dirPath]);
		}
	},
	viewBuilder(){
		return new Promise((resolve, reject) => {
			const renderCompiler = webpack(renderConfig);
			renderCompiler.run(err => {
				if(err){
					reject(chalk.red("打包渲染进程:" + err));
				} else {
					console.log('打包渲染进程完毕！');
					resolve();
				}
			})
		})
	},
	mainBuild(){
		return new Promise((resolve, reject)=>{
			const mainRenderCompiler = webpack(mainRenderConfig);
			mainRenderCompiler.run(err => {
				if(err){
					reject(chalk.red('打包主进程出错' + err));
				} else {
	                console.log('打包主进程完毕！');
	                resolve();
				}
			})
		})
	}
}

build.run();