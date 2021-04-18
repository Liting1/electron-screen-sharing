# RTCPeerConnection 构造函数 

## 静态属性

## 静态方法

1. generateCertificate()

## 实例属性

### 实例自身属性
1. canTrickleIceCandidates: null
2. connectionState: "new"
3. currentLocalDescription: null
4. currentRemoteDescription: null
5. iceConnectionState: "new"
   + 作用： 返回一个ICE代理的状态
   + 取值有：
        - new       ICE 代理正在搜集地址或者等待远程候选可用。
        - checking  ICE 代理已收到至少一个远程候选，并进行校验，无论此时是否有可用连接。同时可能在继续收集候选。
        - connected     ICE代理至少对每个候选发现了一个可用的连接，此时仍然会继续测试远程候选以便发现更优的连接。同时可能在继续收集候选。
        - completed     ICE代理已经发现了可用的连接，不再测试远程候选。
        - failed    ICE候选测试了所有远程候选没有发现匹配的候选。也可能有些候选中发现了一些可用连接。
        - disconnected  测试不再活跃，这可能是一个暂时的状态，可以自我恢复。
        - closed    ICE代理关闭，不再应答任何请求。
    
6. iceGatheringState: "new"
7. localDescription: null
8. onaddstream: null
9. onconnectionstatechange: null
10. ondatachannel: null
11. onicecandidate: null
12. onicecandidateerror: null
13. oniceconnectionstatechange: null
14. onicegatheringstatechange: null
15. onnegotiationneeded: null
16. onremovestream: null
17. onsignalingstatechange: null
18. ontrack: null
19. pendingLocalDescription: null
20. pendingRemoteDescription: null
21. remoteDescription: null
22. sctp: null
23. signalingState: "stable"


### 实例原型属性 (都是响应式属性)
1. canTrickleIceCandidates: null
2. connectionState: 'new' 
3. currentLocalDescription: null
4. currentRemoteDescription: null
5. iceConnectionState: "new"
6. iceGatheringState: "new"
7. localDescription: null
   + 作用：返回一个RTCSessionDescription描述, 获取本地的会话描述(包括配置和媒体信息)
   + RTCSessionDescription
     - 属性
        - type: 会话描述的类型 (RTCSdpType)
          + 取值： answer | offer | pranswer | rollback
            + **answer** 描述了约定配置, 已经完成协商
            + **offer**  会话协商对象开始向呼叫着邀约
            + __pranswer__ 会话描述对象的临时答案
            + __rollback__ 具有空会话描述的此特殊类型用于回滚到先前的稳定状态
        - sdp：会话描述sdp (DOMString)
    
8. onaddstream: null
9. onconnectionstatechange: null
10. ondatachannel: null
11. onicecandidate: null
12. onicecandidateerror: null
13. oniceconnectionstatechange: null
14. onicegatheringstatechange: null
15. onnegotiationneeded: null
16. onremovestream: null
17. onsignalingstatechange: null
18. ontrack: null
19. pendingLocalDescription: null
20. pendingRemoteDescription: null
21. remoteDescription: null
+ 作用： 获取远程连接会话描(包括配置和媒体信息)

## 实例方法

### 实例原型方法
1. addIceCandidate: ƒ addIceCandidate()
2. addStream(stream)
   + 作用： 添加需要传输的媒体流
    
3. addTrack(track, stream...)
   + 作用：将新的媒体轨道添加到轨道集，该轨道将被发送到另一对等方
   + 参数：
        - 第一个参数： 一个MediaStreamTrack对象，表示要添加到对等连接的媒体轨道。
        - 第二以后的参数：一个或多个需要添加轨道的本地MediaStream对象。 
    + 返回值： RTCRtpSender对象，用于传输媒体数据。
        
4. addTransceiver(trackOrKind, init)
   + 作用：创建一个新的RTCRtpTransceiver，并将其添加到与RTCPeerConnection相关联的收发器集中
   + 参数：
        - 第一个参数： 一个与收发器关联的MediaStreamTrack，或者一个DOMString，它被用作接收器的轨道类型，并通过rtcrtreceiver本身的扩展。
        - 第二个参数： 一个符合RTCRtpTransceiverInit字典的对象，它提供了在创建新收发器时需要指定的任何选项
   + 返回值： 返回一个 RTCRtpTransceiver 对象
5. close: ƒ close()
   + 作用： 关闭当前的对等连接。
6. createAnswer([options])
   + 作用： 为从远程对等体收到的要约创建一个SDP应答
   + 参数： 一个对象，包含自定义答案的选项;这是基于RTCAnswerOptions字典的。
   + 返回值: 返回一个字典，该字典包含了要发送给另一个对等体的SDP答案
    
7. createDTMFSender: ƒ createDTMFSender()
8. createDataChannel(label, [options])
   + 作用：创建一个可以发送任意数据的数据通道
   + 参数：
        - 第一个参数：一个便于理解的通道名
        - 第二个参数：一个可选的配置项
9. createOffer(options)
   + 作用： 初始化SDP以及要约的创建
   + 参数： 一个RTCOfferOptions字典，提供报价要求的选项。
   + 返回一个promise
    
10. getConfiguration: ƒ getConfiguration()
11. getLocalStreams: ƒ getLocalStreams()
12. getReceivers: ƒ getReceivers()
13. getRemoteStreams: ƒ getRemoteStreams()
14. getSenders: ƒ getSenders()
15. getStats: ƒ getStats()
16. getTransceivers: ƒ getTransceivers()
17. removeStream()
    + 作用： 移除需要传输的媒体流
18. removeTrack: ƒ removeTrack()
19. restartIce: ƒ restartIce()
20. sctp: (...)
21. setConfiguration: ƒ setConfiguration()
22. setLocalDescription(options)
    + 作用： 指定本地的会话连接属性
    + 参数： 是一个 sessionDescription 对象

23. setRemoteDescription(sessionDescription)
    + 作用：将指定的会话描述设置为远程对等方的当前要约或答案, 该描述指定了连接远程端的属性，包括媒体格式
    + 参数 是远程方的会话描述
    


+ https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/setRemoteDescription
    


24. signalingState: (...)


### 事件
1. iceconnectionstatechange
    + 作用： 用于监听 ICE代理的状态改变



### new RTCPeerConnection(options) 创建一个本地端与远端的一条连接

+ options
```js
    
const options = {
  bundlePolicy: '',
  certificates: '',
  iceCandidatePoolSize: '',
  iceServers: '',
  iceTransportPolicy: ''
}

```

### new RTCSessionDescription(rtcSessionDescriptionInit)

+ 作用： 创建一个新的 RTCSessionDescription具有其属性中指定的对象描述初始化。
+ 参数： rtcSessionDescriptionInit 为一个可选参数类型为一个配置对象 {type: answer | offer | pranswer | rollback, sdp: '''}
+ 返回值： 返回一个新的 RTCSessionDescription 对象
