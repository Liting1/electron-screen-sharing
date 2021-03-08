/*
 * @Author: your name
 * @Date: 2020-10-24 20:29:25
 * @LastEditTime: 2020-12-06 15:06:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue-template\src\main\createWindow\index.js
 */
const { BrowserWindow, dialog } = require('electron');

module.exports = {
	createMianWin(options = {}){
		options = Object.assign({
			width: 1200,	// 窗口宽度
			height: 700,	// 窗口高度
			title: 'mainWin',
			frame: false,
			// autoHideMenuBar:true,
			backgroundColor: '#fff',	// 窗口背景颜色
			show: false,				// 创建窗口后不显示窗口
			hasShadow: false,
			webPreferences:{
				nodeIntegration: true, // 在渲染进程引入node模块
			}
		}, options);
		return new BrowserWindow(options);
	},
	createShareWin(options = {}){
		options = Object.assign({
			width: 1200,
			height: 700,
			title: 'initiateWin',
			webPreferences: {
				nodeIntegration: true //默认是false
			}
		},options);
		return new BrowserWindow(options);
	},
	createViewWin(options = {}){
		options = Object.assign({
			width: 1200,
			height: 800,
			title: 'viewWin',
			webPreferences: {
				nodeIntegration: true
			}
		}, options);
		return new BrowserWindow(options);
	}
}