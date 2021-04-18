
const { RTCPeerConnection } = require('wrtc');

const TIME_TO_CONNECTED = 10000;
const TIME_TO_RECONNECTED = 10000;

class CreateConnection {
  constructor() {
    this.RTCConnection = null;
    this.offer = null;
    this.promise = null;
    this.resolve = null;
    this.reject = null;
    this.timer = null;
    this.reconnectionTimer = null;

    this.handleIcecandidate = this.handleIcecandidate.bind(this);
    this.handleIceconnectionstatechange = this.handleIceconnectionstatechange.bind(this);
  }
  async init(addStream){

    // 创建连接实例
    this.RTCConnection = new RTCPeerConnection({
      sdpSemantics: 'unified-plan'
    });

    // 给实例对象添加事件监听
    this.addEventListen(this.RTCConnection);

    // 添加媒体流
    addStream && addStream(this.RTCConnection);

    // 设置连接超时时间
    let { iceConnectionState } = this.RTCConnection;

    this.timer = setTimeout(() => {
      if(iceConnectionState !== 'connected' && iceConnectionState !== 'completed') {
        this.close();
      }
    }, TIME_TO_CONNECTED);

    // 创建邀约描述
    this.offer = await this.RTCConnection.createOffer();
    // 设置本地描述
    this.RTCConnection.setLocalDescription(this.offer);

    return this;
  }
  addEventListen(rtc){
    rtc.addEventListener('icecandidate', this.handleIcecandidate)
    rtc.addEventListener('iceconnectionstatechange', this.handleIceconnectionstatechange)
  }

  setRemoteDescription(desc){
    this.RTCConnection.setRemoteDescription(desc);
  }


  // 只要本地代理ICE 需要通过信令服务器传递信息给其他对等端时就会触发
  handleIcecandidate({candidate}){
    if(!candidate) {
      this.resolve(this.RTCConnection.localDescription);
      this.RTCConnection.removeEventListener('icecandidate', this.handleIcecandidate);
    }
  }
  // 当ICE候选收集进程的状态发生变化时
  handleIceconnectionstatechange(){
    let { iceConnectionState } = this.RTCConnection;
    // console.log('iceConnectionState', iceConnectionState);
    if(iceConnectionState === 'connected' || iceConnectionState === 'completed') {
      if(this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    } else if(iceConnectionState === 'disconnected' || iceConnectionState === 'failed') {
      if(!this.reconnectionTimer && !this.timer) {
        this.reconnectionTimer = setTimeout(() => {
          this.close();
        }, TIME_TO_RECONNECTED)
      }

    }
  }
  // 创建一个 promise 用于获取本地描述 发送给对等端
  getLocalDescription(){
    return new Promise((resolve, reject) => {
      this.resolve =resolve;
      this.reject =reject;
    });
  }

  // 关闭连接
  close(){
    this.RTCConnection.removeEventListener('iceconnectionstatechange', this.handleIceconnectionstatechange);
    if(this.reconnectionTimer) {
      clearTimeout(this.reconnectionTimer);
      this.reconnectionTimer = null;
    }
    if(this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.RTCConnection.close();
  }

}


module.exports = CreateConnection;


