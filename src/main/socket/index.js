/*
 * @Author: your name
 * @Date: 2020-12-06 15:19:42
 * @LastEditTime: 2020-12-06 17:01:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue-template\src\main\socket\index.js
 */

const WebSocket  = require('ws');
const os = require('os');

class CreateSocket{
    constructor(){
        this.wss = null;
        // 分享视频头帧
        this.header = null;
    }
    init(){
        this.createSocket();
        this.addEventListen();
        console.log('socketServer:'+this.getIPAdress()+':8088')
    }
    createSocket(){
        this.wss = new WebSocket.Server({
            host: this.getIPAdress(),
            port: 8088
        });
    }
    // 获取电脑ip
    getIPAdress() {
        var interfaces = os.networkInterfaces();
        for (var devName in interfaces) {
            var iface = interfaces[devName];
            for (var i = 0; i < iface.length; i++) {
                var alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
    }

    // 进行广播函数
    broadcast(data, ws, noSelf) {
        this.wss.clients.forEach(client => {
            // 广播到包括自己的用户
            if(noSelf){
                if(client.readyState == WebSocket.OPEN){
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

    addEventListen(){
        // 当有客户端连接时触发
        this.wss.on('connection', ws =>{
            this.connectionHandle(ws);
            // 接收客户端发送的消息
            ws.on('message', data => this.messageHandle(data, ws))

            // 当客户端关闭连接时触发
            ws.on('close', ev => this.closeHandle(ev));

            // 当发送错误时触发
            ws.on('error', err=> this.errorHandle(err));
        })
    }
    // 处理客户端发送的消息
    messageHandle(data, ws){
        // 将数据进行广播

        if(typeof data === 'string'){
            // 普通消息
            data = JSON.parse(data);
            // 发起屏幕分享连接成功
            if(data.user == 101 && data.msgCode == 104){
                this.header = null;
            }
            // 观看屏幕分享的用户连接成功
            if(data.user == 102 && data.msgCode == 104){
                if(this.header){
                    // 发送 header
                    ws.send(this.header);
                }
            }
            // this.broadcast(data, ws, true);
        } else {
            // 视频消息,数据拆解
            let msg = data.slice(0, 36).toString();
            let blob = data.slice(36);
            msg = JSON.parse(msg);
            if(msg.msgCode == 101){
                this.header = blob //.slice(0, 10240); // 存储第一帧数据
            } else if(msg.msgCode == 102){
                
            }
           this.broadcast(blob, ws, false);
        }
    }
    // 处理客户端断开连接
    closeHandle(ev){
        console.log('客户端断开连接')
    }
    // 推送消息出现错误
    errorHandle(err){
         console.log(err);
    }
    // 连接成功
    connectionHandle(ws){
        console.log("有客户端连接");
        // ws.send("哈哈哈哈");
    }
}

module.exports = CreateSocket;

