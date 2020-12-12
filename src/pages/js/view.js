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
        this.video = document.querySelector('#vid');
        this.stereo = false;
        this.socktUrl = 'ws://192.168.30.1:8088';
        this.localPeerConnection = null;
        // {
        //     user: 101, // 101 表示分享屏幕 102 表示观看屏幕
        //     msgCode: 101, // 消息类型 101 获取连接ID
        //     data: {}
        // }
    }
    init() {
        this.connectionSocket();
    }
    connectionSocket() {
        this.client = new WebSocket(this.socktUrl);
        // 当客户端连接成功之后就会触发open事件
        this.client.addEventListener('open', (ev) => this.handleOpen(ev));
        this.client.addEventListener('message', (ev) => this.handleMessage(ev));
    }
    send(data) {
        this.client.send(JSON.stringify(data));
    }
    handleOpen(ev) {
        console.log("客户端连接成功");
        this.send({
            user: 102,
            msgCode: 101,
            data: null
        });
    }
    async handleMessage(ev) {
        console.log("接收服务端返回的数据");
        let { user, msgCode, data } = JSON.parse(ev.data);
        if (user === 102) {
            if (msgCode === 101) {
                this.createConnection(data);
            } else if (msgCode === 102) {
                console.log(222, data);
            } else if (msgCode === 103) {
                console.log(333, data);
            }
        }
    }
    close(){
        this.this.localPeerConnection.close();
    }
    async createConnection( { id, localDescription } ) {
        const localPeerConnection = new RTCPeerConnection({
            sdpSemantics: 'unified-plan'
        });
        localPeerConnection.close = ()=> {
             this.send({
                user: 102,
                msgCode: 103,
                data: { id }
            });
            RTCPeerConnection.prototype.close.apply(localPeerConnection);
        }
        try {
            
            await localPeerConnection.setRemoteDescription(localDescription);
            await this.beforeAnswer(localPeerConnection);
            const originalAnswer = await localPeerConnection.createAnswer();
            const updatedAnswer = new RTCSessionDescription({
                type: 'answer',
                sdp: this.stereo ? this.enableStereoOpus(originalAnswer.sdp) : originalAnswer.sdp
            });
            await localPeerConnection.setLocalDescription(updatedAnswer);

            this.send({
                user: 102,
                msgCode: 102,
                data: {
                    id,
                    sdp: localPeerConnection.localDescription.sdp,
                    type: localPeerConnection.localDescription.type
                }
            });
            this.localPeerConnection = localPeerConnection;
        } catch (e) {
            localPeerConnection.close();
            console.log(e);
        }
    }

    async beforeAnswer(peerConnection) {
        const remoteStream = new MediaStream(peerConnection.getReceivers().map(receiver => receiver.track));
        this.video.srcObject = remoteStream;
        const { close } = peerConnection;
        peerConnection.close = () => {
            this.video.srcObject = null;
            return close.apply(peerConnection);
        }
    }

    enableStereoOpus(sdp) {
        return sdp.replace(/a=fmtp:111/, 'a=fmtp:111 stereo=1\r\na=fmtp:111');
    }
}

let view = new View()

document.querySelector('.start').onclick = function() {
    view.init();
}

document.querySelector('.stop').onclick = function() {
    view.close();
}
