const { EventEmitter } = require('events');

const { v4:uuidV4 } = require('uuid');

const Share = require('./share');

/**
 * 创建房间
 */
class CreateRoom {
  constructor(broadcast) {
    this.event = broadcast;
    this.homeowners = null;
    this.homeID = uuidV4();
    this.views = [];
  }

  async init(){
    this.setHomeowners(new Share());
    let localDesc = await this.homeowners.init();
    this.broadcast();
    // 将数据广播给观看用户
    return localDesc;
  }

  // 设置房主
  setHomeowners(owners) {
    this.homeowners = owners;
  }

  // 广播数据
  broadcast(){
    if(this.homeowners.audioTrack && this.homeowners.videoTrack) {
      this.event.emit('broadcast', {
        videoTrack: this.homeowners.videoTrack,
        audioTrack: this.homeowners.audioTrack
      })
    }
  }
  // 设置观看用户
  setView(v) {
    this.views.push(v);
  }
  // 移除观看用户
  removeView(){

  }

  close(){
    // 关闭连接
    this.homeowners.close();

  }
}

module.exports = CreateRoom;
