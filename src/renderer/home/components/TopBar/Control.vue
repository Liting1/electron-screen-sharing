<template>
  <div class="control">
    <Icon type="md-remove" class="md-remove no-drag" @click="handleRemove" />
    <Icon
      v-if="isMax"
      type="ios-browsers-outline"
      class="ios-browsers-outline no-drag"
      @click="handleMaxWin"
    />
    <Icon
      v-else
      type="md-square-outline"
      class="md-square-outline no-drag"
      @click="handleMaxWin"
    />
    <Icon type="md-close" class="md-close no-drag" @click="handleClose" />
  </div>
</template>

<script>
export default {
  name: "Control",
  data() {
    return {
      isMax: false,
    };
  },
  methods: {
    handleRemove() {
      this.$ev.minMainWin();
    },
    handleMaxWin() {
      this.isMax = !this.isMax;
      this.$ev.maxMainWin();
    },
    handleClose() {
      this.$ev.closeMainWin();
    },
  },
};
</script>

<style scoped lang="sass">
.control
  float: right
  margin-right: 20px
  font-size: 20px
  line-height: 46px
  .md-close
    vertical-align: middle
    cursor: pointer
  .md-square-outline
    vertical-align: middle
    font-size: 16px
    margin-right: 4px
    cursor: pointer
  .md-remove
    vertical-align: middle
    font-size: 20px
    margin-right: 4px
    cursor: pointer
  .ios-browsers-outline
    font-size: 16px
    font-weight: bold
    margin-right: 4px
    vertical-align: middle
    color: #000
    cursor: pointer
  .active
    color: #e82a2a
</style>
