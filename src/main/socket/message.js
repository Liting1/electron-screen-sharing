const { EventEmitter } = require('events');
const broadcast = new EventEmitter();
const createRoom = require('./connections/createRoom');
const createView = require('./connections/view');

class Message {
  constructor(ws) {
    // {
    //     user: 101, // 101 表示分享屏幕 102 表示观看屏幕
    //     msgCode: 101, // 消息类型 101 获取连接ID
    //     data: {},
    //     code: 200,
    //     message: 'success'
    // }
    this.ws = null;
    this.room = null;
    this.views = new Map();
  }
  init(ws){
    this.ws = ws;
  }

  send(data) {
    this.ws.send(JSON.stringify(data));
  }

  // 创建连接
  async createConn(user) {
    const data = {
      user,
      msgCode: 101,
      data: null,
      message: 'success',
      code: 200
    }
    try {
      let localDescription = null, id = null;
      if (user === 101) {
        this.room = new createRoom(broadcast);
        localDescription = await this.room.init();
        id = this.room.homeID;
      }

      if(user === 102) {
        let view = new createView(this.room, broadcast);
        localDescription = await view.init();
        id = view.id;
        this.views.set(id, view);
      }

      this.send({
        ...data,
        data: {localDescription, id}
      });
    } catch (e) {
      this.send({
        ...data,
        message: e,
        code: 500
      });
    }
  }

  // 关联远程描述
  async remoteDescription(user, {id, ...desc}) {
    const data = {
      user,
      msgCode: 102,
      data: null,
      message: 'connection is undefined',
      code: 404
    };

    try {
      if(user === 101) {
        this.room.homeowners.setRemoteDescription(desc);
      }
      if(user === 102) {
        // 通过ID获取用户
        let view = this.views.get(id);
        view.setRemoteDescription(desc);
      }
      this.send({
        ...data,
        message: 'success',
        code: 200
      });
    } catch (error) {
      this.send({
        ...data,
        code: 400,
        message: error
      });
    }
  }

  // 关闭连接
  async closeConn(user, {id}) {
    const data = {
      user,
      msgCode: 103,
      data: null,
      message: 'connection is undefined',
      code: 404
    };

    try {
      if(user === 101) {      // 关闭房间
        this.room.close();
        this.room = null;
      }
      if(user === 102) {
        let view = this.views.get(id);
        view.close();
        this.views.delete(id);
      }
      this.send({
        ...data,
        message: 'success',
        code: 200
      });
    } catch (err){
      this.send({
        ...data, err
      })
    }

  }
}

module.exports = new Message;
