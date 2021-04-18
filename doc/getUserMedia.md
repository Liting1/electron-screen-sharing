## 获取本地视频的媒体流 (navigator.mediaDevices)

### getUserMedia(options);

+ options

1. 获取本地摄像头和麦克风媒体流方式

```js

	let options = {
		video: true,
		audio: true
	}
```

#### navigator.mediaDevices.getSupportedConstraints() 获取浏览器设备支持的详细约束

```js
	
	let options = {
		audio: {
			mandatory: { // 约束

			},
			optional: [ // 约束的优先排序

			]
		},
		video: {
			mandatory: { // 约束

			},
			optional: [ // 约束的优先排序

			]
		}
	}
	
	// 具体的约束值：
	{
		aspectRatio: true
		autoGainControl: true		// (boolean)是否要修改麦克风的输入音量
		brightness: true
		channelCount: true			// 规定了单声道的时候为1，立体声的时候为
		colorTemperature: true
		contrast: true
		deviceId: true
		echoCancellation: true		// 是否使用回声消除来尝试去除通过麦克风回传到扬声器的音频
		exposureCompensation: true
		exposureMode: true
		exposureTime: true
		facingMode: true 		// "user" 前置摄像头, "environment" 后置摄像头
		focusDistance: true
		focusMode: true
		frameRate: true         // 设置帧率
		groupId: true
		height: true			// 高度
		iso: true
		latency: true			// 以秒为单位，控制开始处理声音和下一步可以使用数据之间的时间
		noiseSuppression: true	// 是否尝试去除音频信号中的背景噪声
		pointsOfInterest: true
		resizeMode: true
		sampleRate: true		// (number) 指定采样率
		sampleSize: true		// (number) 每个采样点大小的位数
		saturation: true
		sharpness: true
		torch: true
		whiteBalanceMode: true
		width: true				// 宽度
		zoom: true
	}

```



### getDisplayMedia(constraints);

+ options

```js
const optins = {
  video: true,
  audio: true
}



```

### MediaStream 媒体流


#### 属性
+ active
+ ended
+ id


#### 方法

+ addTrack()
+ clone()
+ getTracks()
+ getAudioTracks()
  - 作用： 返回流中kind属性为"audio"的MediaStreamTrack列表
+ getTrackById()
+ getVideoTracks()
  - 作用： 返回流中kind属性为"video"的MediaStreamTrack列表
+ removeTrack()





### 获取媒体流约束取值范围 getCapabilities()
```js
 const options = {
  aspectRatio: {max: 1920, min: 0.000925925925925926},
  brightness: {max: 100, min: 0, step: 1},
  colorTemperature: {max: 6500, min: 2500, step: 10},
  contrast: {max: 100, min: 0, step: 1},
  deviceId: "da97e704def75c68ae5515539a463f14c7e5c5806157a8aefda49273ccdae608",
  facingMode: ["user"],
  frameRate: {max: 30, min: 0},
  groupId: "e5e2f13c887bad7819f27c7fb98b7d473d764d3fbdfd22f7ad277f70c64ba817",
  height: {max: 1080, min: 1},
  resizeMode: (2) ["none", "crop-and-scale"],
  saturation: {max: 100, min: 0, step: 1},
  sharpness: {max: 100, min: 0, step: 1},
  whiteBalanceMode: (2) ["continuous", "manual"],
  width: {max: 1920, min: 1}
}
```

### 获取当前媒体流的约束具体值 getSettings()

```js
let options = {
  aspectRatio: 1.3333333333333333,
  brightness: 50,
  colorTemperature: 4500,
  contrast: 50,
  deviceId: "da97e704def75c68ae5515539a463f14c7e5c5806157a8aefda49273ccdae608",
  facingMode: "user",
  frameRate: 30,
  groupId: "3406d13b63a7a18afe2d38589d49aef3ed946dca6df2387366f32db9733e5d47",
  height: 480,
  resizeMode: "none",
  saturation: 50,
  sharpness: 50,
  whiteBalanceMode: "continuous",
  width: 640
}
```

