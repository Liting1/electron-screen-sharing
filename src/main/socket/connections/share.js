
const CreateConnection = require('./createConnection');
const CreateRoom = require('./createRoom');

/**
 * 用户分享
 */
class Share {
  constructor() {
    this.conn = new CreateConnection();
    this.audioTrack = null;
    this.videoTrack = null;
    // 本地描述 用于发送给远程对等端
    this.localDesc = null;
  }

  async init(){
    await this.conn.init(conn => this.addStream(conn));
    this.localDesc = await this.conn.getLocalDescription();
    return this.localDesc;
  }
  // 添加媒体流
  addStream(conn){
    this.audioTrack = conn.addTransceiver('audio').receiver.track;
    this.videoTrack = conn.addTransceiver('video').receiver.track;
  }
  // 设置远程对等端描述
  setRemoteDescription(desc){
    this.conn.setRemoteDescription(desc);
  }

  // 关闭连接
  close(){
    // 停止媒体流传输
    this.audioTrack.stop();
    this.videoTrack.stop();
    this.conn.close();
  }
}

module.exports = Share;
