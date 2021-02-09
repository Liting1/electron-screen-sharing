<template>
  <div class="top-bar">
    <Control/>
  </div>
</template>
<script>
import Control from "./Control";

export default {
  name: 'TopBar',
  data() {
    return {}
  },
  components: {
    Control,
  }
}
</script>
<style scoped lang="sass">
.top-bar
  height: 50px
  background-color: #ccc

</style>
