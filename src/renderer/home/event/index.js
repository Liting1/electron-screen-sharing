/*
 * @Author: your name
 * @Date: 2020-10-26 21:15:35
 * @LastEditTime: 2020-12-06 15:14:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue-template\src\renderer\event\index.js
 */
const { ipcRenderer } = require('electron');

export default {
	// 最小化窗口
	minMainWin(){
		ipcRenderer.send('min-main-win');
	},
	// 窗口最大化
	maxMainWin(){
		ipcRenderer.send('max-main-win');
	},
	closeMainWin(){
		ipcRenderer.send('close-main-win');
	},

	openShareWin(){
		ipcRenderer.send("open-share-win")
	},
	openViewWin(){
		ipcRenderer.send('open-view-win');
	}
}

