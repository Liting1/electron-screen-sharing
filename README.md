


### 使用

1. `git clone https://github.com/Liting1/electron-vue-template.git`
2. `npm install`
3. `npm run dev` 开发
4. `npm run build` 生产打包




### 功能
1. 热加载开发
2. 打包生成App

### 项目目录结构

```
|—— app						webpack 构建输出文件目录
|—— pack					打包软件输出目录
|—— builder					webpack配置文件目录
|—— config					配置文件目录
|—— src 					项目资源目录
|	 |—— main 				主进程目录
|	 |—— pages 				其他页面目录
|	 |—— renderer	  		渲染进程目录
|—— .babelrc 				Babel配置文件
|—— .gitignore
|—— package-lock.json
|—— package.json
|—— README.md

```

SourceMap: 配置参考地址：
1. https://juejin.im/post/6844903450644316174
2. https://webpack.js.org/configuration/devtool/#development

node: 配置参考：


## css-loader
1. https://vue-loader.vuejs.org/zh/guide/extract-css.html#webpack-4


1. 打包App
2. 热更新
3. 路由模式History

参考网站： https://github.com/mubaidr/vue-electron-template

https://www.cnblogs.com/kakayang/p/11766273.html


## main

https://blog.csdn.net/Cceking/article/details/80297249?ops_request_misc=%25257B%252522request%25255Fid%252522%25253A%252522160715463019195283074361%252522%25252C%252522scm%252522%25253A%25252220140713.130102334.pc%25255Fall.%252522%25257D&request_id=160715463019195283074361&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~first_rank_v2~rank_v29-18-80297249.first_rank_v2_pc_rank_v29&utm_term=nodejs%20webrtc%E6%8E%A8%E6%B5%81


https://blog.csdn.net/vikanill/article/details/99213067?ops_request_misc=&request_id=&biz_id=102&utm_term=webRTC%2520MediaRecorder%2520%25E5%25BD%2595%25E5%2588%25B6%25E7%259A%2584%25E8%25A7%2586%25E9%25A2%2591%25E6%2580%258E%25E4%25B9%2588%25E5%25AE%259E%25E7%258E%25B0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-3-99213067.first_rank_v2_pc_rank_v29


### node web_rtc
https://github.com/node-webrtc/node-webrtc


### webpack chunks配置
https://blog.csdn.net/weixin_42618289/article/details/105529296?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522160791078819725271629132%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=160791078819725271629132&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduend~default-4-105529296.first_rank_v2_pc_rank_v29&utm_term=webpack%20%E9%85%8D%E7%BD%AE%E6%89%93%E5%8C%85%E5%A4%9A%E9%A1%B5%E9%9D%A2&spm=1018.2118.3001.4449