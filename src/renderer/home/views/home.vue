<template>
<div class="home">
	<top-bar />
	<div class="home-content">
		<nav-bar />
    	<div class="home-view">
			<view-content />
    	</div>
	</div>
</div>
</template>

<script>
import TopBar from '@/components/TopBar';
import NavBar from '@/components/NavBar';
import ViewContent from '@/components/ViewContent';
export default {
	name: 'home',
	components: {
		TopBar,
		NavBar,
		ViewContent,
	},
	methods: {
		openInitiate(){
			this.$ev.openInitiateWin();
		},
		openView(){
			this.$ev.openViewWin();
		},
		alert(){
			
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
