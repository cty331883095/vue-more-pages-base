<template>
<div>
  <test-one v-for="item in title"
  v-bind:key="item.id"
  v-bind:params="item"
></test-one>
</div>

</template>
<script>
import TestOne from '@/components/test/TestOne'
export default {
  name: 'Hoook',
  data () {
    return {
      title: [{id: 33, name: 'xiaoming'}, {id: 43, name: 'xiaohong'}]
    }
  },
  mounted () {

  },
  components: {
    TestOne
  }

}
</script>
<style scoped>

</style>
