
const CreateConnection = require('./createConnection');
const {v4: uuidV4} = require('uuid');
class View {
  constructor(room, broadcast) {
    this.conn = new CreateConnection();
    this.localDesc = null;
    this.videoTransceiver = null;
    this.audioTransceiver = null;
    this.onBroadcast = this.onBroadcast.bind(this);
    this.event = broadcast;
    this.id = uuidV4();
    this.room = room;
  }
  async init(){
    await this.conn.init((conn) => this.addStream(conn));
    this.localDesc =  await this.conn.getLocalDescription();
    return this.localDesc;
  }

  // 添加媒体流
  addStream(conn){
    this.audioTransceiver = conn.addTransceiver('audio');
    this.videoTransceiver = conn.addTransceiver('video');
    if(this.room) {
      this.onBroadcast({
        audioTrack: this.room.homeowners.audioTrack,
        videoTrack: this.room.homeowners.videoTrack
      });
    }
    this.event.on('broadcast', this.onBroadcast)
  }

  // 设置远程描述
  setRemoteDescription(desc){
    this.conn.setRemoteDescription(desc);
  }

  // 广播事件监听函数
  onBroadcast({audioTrack,videoTrack}){
      this.audioTransceiver.sender.replaceTrack(audioTrack).catch(e => {
        console.log('view.onBroadcast1', e);
      });
      this.videoTransceiver.sender.replaceTrack(videoTrack).catch(e => {
        console.log('view.onBroadcast2', e);
      });
  }
  // 关闭连接
  close(){
    // 移除事件监听函数
    this.event.removeListener('broadcast', this.onBroadcast);
    this.conn.close();
  }
}

module.exports = View;
