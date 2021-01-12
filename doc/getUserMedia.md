## 获取本地视频的媒体流

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
		frameRate: true
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


https://blog.csdn.net/a250758092/article/details/84676803