<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    console.log('执行完成')
  }
}
</script>
<style lang="less">
#app {
  // width: 1920px;
  // height: 1080px;
  width: 100%;
  height: 100%;
  // background: lawngreen;
}
</style>
