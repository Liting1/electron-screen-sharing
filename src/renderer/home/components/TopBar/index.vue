<template>
  <div class="top-bar drag">
    <Search />
    <Control/>
  </div>
</template>
<script>
import Control from "./Control";
import Search from "./Search";

export default {
  name: 'TopBar',
  data() {
    return {}
  },
  components: {
    Control,
    Search
  }
}
</script>
<style scoped lang="sass">
.top-bar
  height: 50px
  background-color: #ccc
  display: flex

</style>
