/*
 * @Author: your name
 * @Date: 2020-12-06 15:19:42
 * @LastEditTime: 2020-12-12 23:55:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue-template\src\main\socket\index.js
 */

const WebSocket = require('ws');
const os = require('os');
const Message = require('./message');

class CreateSocket extends Message {
  constructor() {
    super()
    this.wss = null;
  }

  init() {
    this.createSocket();
    this.addEventListen();
    console.log('socketServer:' + this.getIPAdress() + ':8088')
  }

  createSocket() {
    this.wss = new WebSocket.Server({
      host: this.getIPAdress(),
      port: 8088
    });
  }

  // 获取电脑ip
  getIPAdress() {
    const interfaces = os.networkInterfaces();
    for (let devName in interfaces) {
      const iface = interfaces[devName];
      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address;
        }
      }
    }
  }

  // 进行广播函数
  broadcast(data, ws, noSelf = true) {
    this.wss.clients.forEach(client => {
      // 广播到包括自己的用户
      if (noSelf) {
        if (client.readyState == WebSocket.OPEN) {
          client.send(data);
        }
      } else {
        // 广播不包括自己的用户
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      }
    })
  }

  addEventListen() {
    // 当有客户端连接时触发
    this.wss.on('connection', ws => {
      this.connectionHandle(ws);
      // 接收客户端发送的消息
      ws.on('message', data => this.messageHandle(data, ws));

      // 当客户端关闭连接时触发
      ws.on('close', ev => this.closeHandle(ev));

      // 当发送错误时触发
      ws.on('error', err => this.errorHandle(err));
    })
  }

  // 处理客户端发送的消息
  messageHandle(d, ws) {
    let {user, msgCode, data} = JSON.parse(d);

    if (user === 101 || user === 102) {
      if (msgCode === 101) {
        // 表示生成ID
        this.getID(ws, user);
      } else if (msgCode === 102) {
        // 设置连接内容
        this.remoteDescription(ws, user, data);
      } else if (msgCode === 103) {
        // 关闭分享删除连接ID
        this.deleteID(ws, user, data);
      }
    }
  }

  // 处理客户端断开连接
  closeHandle(ev) {
    console.log('客户端断开连接')
  }

  // 推送消息出现错误
  errorHandle(err) {
    console.log(err);
  }

  // 连接成功
  connectionHandle(ws) {
    console.log("有客户端连接22");
  }
}

module.exports = new CreateSocket;
