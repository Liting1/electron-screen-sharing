<template>
  <div>
    <div>
      <video width="100%" id="vid" autoplay ref="vid"></video>
    </div>
    <div class="controls">
      <Button @click="connectionSocket">开始</Button>
      <Button @click="close">结束</Button>
    </div>
  </div>
</template>

<script>
/* {
  用户类型： 101 表示分享屏幕 102 表示观看屏幕
      user: 101,
  消息类型： 101 获取连接ID, 102 发送连接信令, 103 关闭连接
      msgCode: 101,
      data: {}
} */
export default {
  name: "viewContent",
  data() {
    return {
      client: null,
      stereo: false,
      localPeerConnection: null,
      video: null,
      socketUrl: "ws://192.168.30.1:8088",
    };
  },
  mounted() {
    this.video = this.$refs.vid;
  },
  methods: {
    connectionSocket() {
      this.client = new WebSocket(this.socketUrl);
      // 当客户端连接成功之后就会触发open事件
      this.client.addEventListener("open", (ev) => this.handleOpen(ev));
      this.client.addEventListener("message", (ev) => this.handleMessage(ev));
    },
    handleOpen() {
      console.log("客户端连接成功");
      this.send({
        user: 102,
        msgCode: 101,
        data: null,
      });
    },
    send(data) {
      this.client.send(JSON.stringify(data));
    },
    async handleMessage(ev) {
      console.log("接收服务端返回的数据");
      let { user, msgCode, data } = JSON.parse(ev.data);
      if (user === 102) {
        if (msgCode === 101) {
          console.log(101, data)
          this.createConnection(data);
        } else if (msgCode === 102) {
          console.log(222, data);
        } else if (msgCode === 103) {
          console.log(333, data);
        }
      }
    },

    async createConnection({ id, localDescription }) {
      const localPeerConnection = new RTCPeerConnection({
        sdpSemantics: "unified-plan",
      });
      localPeerConnection.close = () => {
        this.send({
          user: 102,
          msgCode: 103,
          data: { id },
        });
        RTCPeerConnection.prototype.close.apply(localPeerConnection);
      };
      try {
        await localPeerConnection.setRemoteDescription(localDescription);
        await this.beforeAnswer(localPeerConnection);
        const originalAnswer = await localPeerConnection.createAnswer();
        const updatedAnswer = new RTCSessionDescription({
          type: "answer",
          sdp: this.stereo
            ? this.enableStereoOpus(originalAnswer.sdp)
            : originalAnswer.sdp,
        });
        await localPeerConnection.setLocalDescription(updatedAnswer);

        this.send({
          user: 102,
          msgCode: 102,
          data: {
            id,
            sdp: localPeerConnection.localDescription.sdp,
            type: localPeerConnection.localDescription.type,
          },
        });
        this.localPeerConnection = localPeerConnection;
      } catch (e) {
        localPeerConnection.close();
        console.log(e);
      }
    },
    async beforeAnswer(peerConnection) {
      const remoteStream = new MediaStream(
        peerConnection.getReceivers().map((receiver) => receiver.track)
      );
      this.video.srcObject = remoteStream;
      const { close } = peerConnection;
      peerConnection.close = () => {
        this.video.srcObject = null;
        return close.apply(peerConnection);
      };
    },
    enableStereoOpus(sdp) {
      return sdp.replace(/a=fmtp:111/, "a=fmtp:111 stereo=1\r\na=fmtp:111");
    },
    close() {
      this.localPeerConnection.close();
    },
  },
};
</script>

<style scoped lang="sass">
#vid
  background-color: #2c3e50
</style>
