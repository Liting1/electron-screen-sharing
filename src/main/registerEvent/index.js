/*
 * @Author: your name
 * @Date: 2020-10-26 21:22:49
 * @LastEditTime: 2020-12-06 15:14:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue-template\src\main\registerEvent\index.js
 */
const { ipcMain } = require('electron');
const { createInitiateWin, createViewWin } = require('../createWindow');
const path = require('path');
const url = require('url');
const {getWin} = require('../utils');

class AddEvent {
	constructor(){
		this.win = null;
		this.initiate = null;
		this.view = null;
	}
	init(){
		this.win = getWin('mainWin');
		this.openInitiateWin();
		this.openViewWin();

	}
	getPath(file){
		let url = process.env.NODE_ENV === 'development'
			? '../../pages/html/' : 'pages/html/';
		return path.join(__dirname, url+file);
	}
	openInitiateWin(){
		ipcMain.on('open-initiate-win', ()=>{
			if(this.initiate){
				return this.initiate.show();
			}
			this.initiate = createInitiateWin();
			let filePath = url.pathToFileURL(this.getPath('initiate.html')).href;
			this.initiate.loadURL(filePath);
			this.initiate.on('closed',()=>{
				this.initiate = null;
				console.log('initiate is closed');
			})
		})
	}
	openViewWin(){
		ipcMain.on('open-view-win', ()=>{
			if(this.view){
				return this.view.show();
			}
			this.view = createViewWin();
			let filePath = url.pathToFileURL(this.getPath('view.html')).href;
			this.view.loadURL(filePath);
			this.view.on('closed',()=>{
				this.view = null;
				console.log('view is closed');
			})
		})
	}
}

module.exports = new AddEvent;