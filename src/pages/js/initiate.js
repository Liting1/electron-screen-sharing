/*
 * @Author: your name
 * @Date: 2020-11-26 19:38:27
 * @LastEditTime: 2020-12-08 00:25:11
 * @LastEditors: Please set LastEditors
 * @Description: 发起桌面共享页面
 * @FilePath: \electron-vue-template\src\pages\js\update.js
 */

const { desktopCapturer } = require('electron');

class Initiate {
    constructor(){
        this.video = this.getEl('#move');
        this.client = null;
        this.oneHeader = true;
        this.sendData = {
            user: 101, // 101 表示分享屏幕 102 表示观看屏幕
            msgCode: 101, // 消息类型 101 视频header 102 视频其他段 103 视频结束 104 身份消息
            size: 36
        }
    }
    getEl(selector){
        return document.querySelector(selector);
    }
    // 初始化函数
    init(){
        this.getStream();
        this.createSocket('ws://192.168.22.136:8088');
    }
    // 创建socket连接
    createSocket(url){
        this.client = new WebSocket(url);
        this.client.addEventListener('open', (ev)=> this.handleOpen(ev));
        this.client.addEventListener('close', (ev)=> this.handleClose(ev));
        this.client.addEventListener('error', (ev)=> this.handleError(ev));
        this.client.addEventListener('message', (ev)=> this.handleEessage(ev));
    }
    // 客户端连接服务器成功
    handleOpen(ev){
        console.log('客户端连接成功');
        this.sendData.msgCode = 104
        this.client.send(JSON.stringify(this.sendData));
    }
    // 客户端断开服务器连接
    handleClose(ev){
        console.log("客户端断开连接");
    }
    // 
    handleError(ev){
        console.log("客户端连接出错");
    }
    // 
    handleEessage(ev){
        // console.log("获取服务端推送的消息")
    }
    // 获取录制视频
    getStream(){
        desktopCapturer.getSources({
            types: ['window', 'screen']
        }).then(async sources => {
            for (const source of sources) {
                if (source.name === "Entire Screen") {
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({
                            audio: false,
                                video: {
                                mandatory: {
                                    chromeMediaSource: 'desktop',
                                    chromeMediaSourceId: source.id,
                                    maxWidth: window.screen.width,
                                    maxHeight: window.screen.height,
                                    minHeight: 500,
                                    maxHeight: 500
                                }
                            }
                        })
                        this.handleStream(stream)
                    } catch (e) {
                        console.log(e);
                    }
                    return
                }
            }
        })
    }
    // 处理视频流
    handleStream(stream){
        this.video.srcObject = stream
        this.video.onloadedmetadata = (e) => this.video.play();
        this.createRecorder(stream);
    }
    // 录制视频流
    createRecorder(stream){
        let recorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp8'
        });
        // 开始录制
        this.getEl('.start').onclick = ()=>{
            recorder.start(1000);
        }

        // 暂停/继续播放
        this.getEl('.pause').onclick = ()=>{
            if(recorder.state === 'paused'){
                recorder.resume();
            } 
            else if(recorder.state === 'recording'){
                recorder.pause();
            }
        }
        this.getEl('.stop').onclick = ()=>{
            recorder.stop();
            playVideo();
        }
        recorder.ondataavailable = event =>{
            let data = null;
            if(this.oneHeader){
                this.oneHeader = false;
                this.sendData.msgCode = 101
                data = new Blob([JSON.stringify(this.sendData), event.data])
            } else {
                this.sendData.msgCode = 102
                data = new Blob([JSON.stringify(this.sendData), event.data])
            }
            console.log(event.data);
            this.client.send(data);
        }
        recorder.onerror = e =>{
            console.log(e);
        }
        recorder.onresume = e=>{
            console.log("恢复录制了");
        }
        recorder.onpause = e=>{
            console.log("暂停录制")
        }
        recorder.onstart = e=>{
            console.log("开始录制")
        }
    }
    test(){

    }
}

// 实例化对象
new Initiate().init();