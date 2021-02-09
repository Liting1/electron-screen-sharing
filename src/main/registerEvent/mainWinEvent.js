const {ipcMain} = require('electron')

module.exports = {
  win: null,
  init(win) {
    this.win = win;
    this.minMainWin(win);
    this.maxMainWin(win);
    this.closeMainWin(win);
  },
  // 最小化主窗口
  minMainWin(win) {
    ipcMain.on('min-main-win', () => {
      win.minimize()
    })
  },
  // 最大化主窗口
  maxMainWin(win) {
    ipcMain.on('max-main-win', () => {
      // 判断窗口是否最大化
      if (win.isMaximized()) {
        win.unmaximize()
      } else {
        win.maximize()
      }
    })
  },
  // 关闭窗口
  closeMainWin(win) {
    ipcMain.on('close-main-win', () => {
      win.close()
    })
  }
}
