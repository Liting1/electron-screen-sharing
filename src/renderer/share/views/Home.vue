<template>
  <div>
    <div>
      <video autoplay muted ref="vid"></video>
    </div>
    <div class="btn">
      <button class="start" @click="createSocket">开始</button>
      <button class="pause">暂停/恢复</button>
      <button class="stop" @click="close">停止</button>
    </div>
  </div>
</template>

<script>
/* {
    user: 101, // 101 表示分享屏幕 102 表示观看屏幕
    msgCode: 101, // 消息类型 101 获取连接ID
    data: {}
} */
const { desktopCapturer } = require('electron');
export default {
  data() {
    return {
      client: null,
      stereo: false,
      socktUrl: "ws://192.168.30.1:8088",
      localPeerConnection: null,
      video: null,
    };
  },
  mounted(){
      this.video= this.$refs.vid;
  },
  methods: {
    // 创建socket连接
    createSocket() {
      this.client = new WebSocket(this.socktUrl);
      this.client.addEventListener("open", (ev) => this.handleOpen(ev));
      this.client.addEventListener("close", (ev) => this.handleClose(ev));
      this.client.addEventListener("error", (ev) => this.handleError(ev));
      this.client.addEventListener("message", (ev) => this.handleEessage(ev));
    },
    // 发生消息到服务器
    send(data) {
      this.client.send(JSON.stringify(data));
    },
    // 客户端连接服务器成功
    handleOpen(ev) {
      console.log("客户端连接成功");
      this.send({
        user: 101,
        msgCode: 101,
        data: null,
      });
    },
    // 客户端断开服务器连接
    handleClose(ev) {
      console.log("客户端断开连接");
    },
    //
    handleError(ev) {
      console.log("客户端连接出错");
    },
    // 关闭连接
    close() {
      this.localPeerConnection.close();
    },
    handleEessage(ev) {
      console.log("获取服务端推送的消息");
      let { user, msgCode, data } = JSON.parse(ev.data);
      if (user === 101) {
        if (msgCode === 101) {
          this.createConnection(data);
        } else if (msgCode === 102) {
          console.log(2, data);
        } else if (msgCode === 103) {
          console.log(3, data);
        }
      }
    },
    // 获取录制视频
    getStream(peerConnection) {
      return new Promise((resolve) => {
        desktopCapturer
          .getSources({
            types: ["window", "screen"],
          })
          .then(async (sources) => {
            for (const source of sources) {
              if (source.name === "Entire Screen") {
                try {
                  // 获取本地电脑的媒体流
                  const stream = await navigator.mediaDevices.getUserMedia({
                    // audio: true,
                    // audio: {
                    //     mandatory: { // 能够捕获电脑其他应用程序发出的声音
                    //         chromeMediaSource: 'desktop',
                    //     }
                    // },
                    video: {
                      mandatory: {
                        chromeMediaSource: "desktop",
                        // chromeMediaSourceId: source.id,
                        maxWidth: window.screen.width,
                        maxHeight: window.screen.height,
                        minHeight: 500,
                        maxHeight: 500,
                      },
                    },
                  });

                  stream
                    .getTracks()
                    .forEach((track) => peerConnection.addTrack(track, stream));
                  this.video.srcObject = stream;
                  let { close } = peerConnection;
                  peerConnection.close = () => {
                    this.video.srcObject = null;
                    stream.getTracks().forEach((track) => track.stop());
                    return close.apply(peerConnection);
                  };
                  resolve(stream);
                } catch (e) {
                  console.log(e);
                }
                return;
              }
            }
          });
      }).catch((err) => console.log(err));
    },
    async createConnection({ id, localDescription }) {
      const localPeerConnection = new RTCPeerConnection({
        sdpSemantics: "unified-plan",
      });
      localPeerConnection.close = () => {
        this.send({
          user: 101,
          msgCode: 103,
          data: { id },
        });
        this.client.close();
        return RTCPeerConnection.prototype.close.apply(localPeerConnection);
      };

      try {
        await localPeerConnection.setRemoteDescription(localDescription);
        await this.getStream(localPeerConnection);
        const originalAnswer = await localPeerConnection.createAnswer();
        const updatedAnswer = new RTCSessionDescription({
          type: "answer",
          sdp: this.stereo
            ? this.enableStereoOpus(originalAnswer.sdp)
            : originalAnswer.sdp,
        });
        await localPeerConnection.setLocalDescription(updatedAnswer);
        this.send({
          user: 101,
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
    enableStereoOpus(sdp) {
      return sdp.replace(/a=fmtp:111/, "a=fmtp:111 stereo=1\r\na=fmtp:111");
    },
    // 录制视频流
    createRecorder(stream) {
      let recorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8",
      });
      // 开始录制
      this.getEl(".start").onclick = () => {
        recorder.start(1000);
      };

      // 暂停/继续播放
      this.getEl(".pause").onclick = () => {
        if (recorder.state === "paused") {
          recorder.resume();
        } else if (recorder.state === "recording") {
          recorder.pause();
        }
      };
      this.getEl(".stop").onclick = () => {
        recorder.stop();
        playVideo();
      };
      recorder.ondataavailable = (event) => {
        console.log(event.data);
      };
      recorder.onerror = (e) => {
        console.log(e);
      };
      recorder.onresume = (e) => {
        console.log("恢复录制了");
      };
      recorder.onpause = (e) => {
        console.log("暂停录制");
      };
      recorder.onstart = (e) => {
        console.log("开始录制");
      };
    },
  },
};
</script>