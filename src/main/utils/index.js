const { BrowserWindow } = require('electron');

const getWin = title => (
  BrowserWindow.getAllWindows().filter(wins => wins.title === title)[0]
);

const log = (...arg) => {
  const win = getWin('mainWin');
  win.on('show', () => {
    win.webContents.send('win-log', ...arg);
  });
};

module.exports = { getWin, log };
