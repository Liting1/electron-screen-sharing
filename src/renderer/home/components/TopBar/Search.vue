<template>
<div class="search">
  <div class="search-content">
    <Input class="no-drag search-input">
      <Button slot="append" @click="handleClick">连接</Button>
    </Input>
  </div>
</div>
</template>

<script>
export default {
  name: "Search",
  methods:{
    handleChange(){
      console.log(2222)
    },
    handleClick(){
      console.log(111)
    }
  }
}
</script>

<style scoped lang="sass">
.search
  flex: 1
  height: 100%
  .search-content
    display: flex
    width: 300px
    height: 100%
    margin-left: 160px
    .search-input
      margin: auto

</style>
