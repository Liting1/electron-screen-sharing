/*
 * @Author: your name
 * @Date: 2020-10-26 21:22:49
 * @LastEditTime: 2020-12-06 15:14:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue-template\src\main\registerEvent\index.js
 */
const { ipcMain } = require('electron');
const { createShareWin, createViewWin } = require('../createWindow');
const path = require('path');
const url = require('url');
const { getWin } = require('../utils');
const mainWinEvent = require('./mainWinEvent');

class AddEvent {
	constructor(){
		this.win = null;
		this.share = null;
		this.view = null;
	}
	init(){
		this.win = getWin('mainWin');
		this.openShareWin();
		this.openViewWin();
		mainWinEvent.init(this.win);
	}
	getPath(file){
		let filePath = process.env.NODE_ENV === 'production'
			? url.pathToFileURL(path.join(__dirname, file)).href
			: `http://localhost:8090/${file}`;
			return filePath;
		// let url = process.env.NODE_ENV === 'development'
		// 	? '../../pages/html/' : 'pages/html/';
		// return path.join(__dirname, url+file);
	}
	openShareWin(){
		ipcMain.on('open-share-win', ()=>{
			if(this.share){
				return this.share.show();
			}
			this.share = createShareWin();
			this.share.loadURL(this.getPath('share.html'));
			this.share.on('closed',()=>{
				this.share = null;
				console.log('share is closed');
			})
		})
	}
	openViewWin(){
		ipcMain.on('open-view-win', ()=>{
			if(this.view){
				return this.view.show();
			}
			this.view = createViewWin();
			this.view.loadURL(this.getPath('view.html'));
			this.view.on('closed',()=>{
				this.view = null;
				console.log('view is closed');
			})
		})
	}
}

module.exports = new AddEvent;
