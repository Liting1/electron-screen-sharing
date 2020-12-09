/*
 * @Author: your name
 * @Date: 2020-12-06 16:58:24
 * @LastEditTime: 2020-12-06 16:58:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \electron-vue-template\src\pages\js\view.js
 */

class View {
    constructor() {
        this.client = null;
        this.queue = [];
        this.sourceBuffer = null;
        this.MediaSource = null;
        this.video = document.querySelector('#vid');
        this.mime = 'video/webm;codecs=vp8';
        this.socktUrl = 'ws://192.168.30.1:8088';
        this.sendData = {
            user: 102, // 101 表示分享屏幕 102 表示观看屏幕
            msgCode: 100, // 消息类型 101 视频header 102 视频其他段 103 视频结束 104 身份消息
            size: 36
        }
    }
    init(){
		this.createMediaSource();
		this.connectionSocket();
		this.clientEvent();
    }
    connectionSocket() {
        this.client = new WebSocket(this.socktUrl);
    }
    createMediaSource() {
        this.mediaSource = new MediaSource();
    }
    clientEvent() {
        // 当客户端连接成功之后就会触发open事件
        this.client.addEventListener('open', (ev) => this.handleOpen(ev));
        this.client.addEventListener('message', (ev) => this.handleMessage(ev));

    }
    handleOpen(ev) {
        console.log("客户端连接成功");
        this.sendData.msgCode = 104;
        this.client.send(JSON.stringify(this.sendData));
        this.playVideo();
    }
    handleMessage(ev) {
        // console.log(ev);
        this.queue.push(ev.data);
        this.queue.shift().arrayBuffer().then(res => {
        	console.log(res);
            this.sourceBuffer.appendBuffer(res);
        })
    }
    playVideo() {
        let { mediaSource, video } = this;
        video.src = URL.createObjectURL(mediaSource);
        mediaSource.addEventListener('sourceopen', (ev) => this.sourceopen(ev));
        mediaSource.addEventListener('sourceopen', function(e) { console.log('sourceopen: ' + mediaSource.readyState); });
        mediaSource.addEventListener('sourceended', function(e) { console.log('sourceended: ' + mediaSource.readyState); });
        mediaSource.addEventListener('sourceclose', function(e) { console.log('sourceclose: ' + mediaSource.readyState); });
        mediaSource.addEventListener('error', function(e) { console.log('error: ' + mediaSource.readyState); });
    }
    sourceopen(ev) {
        let { mediaSource, queue, video } = this;

        URL.revokeObjectURL(video.src);
        this.sourceBuffer = mediaSource.addSourceBuffer(this.mime);
        let sourceBuffer = this.sourceBuffer;
        sourceBuffer.addEventListener('updatestart', function(e) { console.log('updatestart: ' + mediaSource.readyState); });
        sourceBuffer.addEventListener('update', function(e) { console.log('update: ' + mediaSource.readyState); });
        sourceBuffer.addEventListener('updateend', function(e) { console.log('updateend: ' + mediaSource.readyState); });
        sourceBuffer.addEventListener('error', function(e) {
            console.log('error: ' + mediaSource.readyState);
        });
        sourceBuffer.addEventListener('abort', function(e) { console.log('abort: ' + mediaSource.readyState); });

        sourceBuffer.addEventListener('update', function() {
            if (queue.length > 0 && !sourceBuffer.updating) {
                queue.shift().arrayBuffer().then(res => {
                    sourceBuffer.appendBuffer(res);
                })
            }
        });
    }
}

new View().init();