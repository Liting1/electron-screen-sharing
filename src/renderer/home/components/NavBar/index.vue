<template>
  <div class="nav-bar">
    <Button @click="openInitate">发起屏幕共享</Button>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  methods: {
    openInitate(){
      console.log(this.$ev);
      this.$ev.openShareWin();
    }
  }
}
</script>

<style scoped lang="sass">
  .nav-bar
    height: 100%
    width: 160px
    background-color: aqua
    float: left
    text-align: center
</style>
