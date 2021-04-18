### 共享方
1. 向服务端获取 RTCSessionDescription描述
2. 设置服务端返回的会话描述符 setRemoteDescription(描述)
3. 共享方 获取本地电脑的视频源和音频源
4. 根据服务器返回的会话描述符 生成对应的应答信息(也就是一个会话描述符)
5. 将生成的应答信息发送给服务端(也就是一个 RTCSessionDescription描述)
6. 服务端收到会话描述时，将其进行设置 setRemoteDescription(描述)
7. 服务端设置 会话描述成功后， 会将设置后的会话描述返回给前端

