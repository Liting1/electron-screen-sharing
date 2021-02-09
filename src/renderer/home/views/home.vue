<template>
<div class="home">
	<top-bar />
	<div class="home-content">
		<nav-bar />
    <div class="home-view"></div>
	</div>
	<!-- <input type="text" @copy="copyHandle" @paste="pasteHandle"> -->
<!--	<Button @click="openInitiate">发起屏幕共享</Button>-->
<!--	<Button @click="openView">观看屏幕分享</Button>-->
<!--	<Button @click="notice">显示通知</Button>-->

</div>
</template>

<script>
import TopBar from '@/components/TopBar';
import NavBar from '@/components/NavBar';
export default {
	name: 'home',
	components: {
		TopBar,
		NavBar,
	},
	methods: {
		openInitiate(){
			this.$ev.openInitiateWin();
		},
		openView(){
			this.$ev.openViewWin();
		},
		alert(){
			console.log(window.env);
			alert('hello electron');
		},
		// 复制事件
		copyHandle(e){
			console.log(e);
		},
		// 粘贴事件
		pasteHandle(e){
			console.log(e);
		},
		notice(){
			const myNotification = new Notification('通知标题', {
				body: '通知的主体内容'
			});
			myNotification.onclick = () => {
			  console.log('Notification clicked')
			}
		}
	}
}
</script>

<style lang="sass" scoped>
  .home
    width: 100%
    height: 100%
    .home-content
      height: calc(100% - 50px)
      .home-view
        overflow: hidden
        height: 100%
        background-color: coral

</style>
