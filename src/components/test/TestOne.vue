<template>
<ul class="title-box">
  <li class="item-box">{{params.id}}</li>
  <li class="item-box">{{params.name}}</li>
</ul>

</template>
<script>
export default {
  name: 'Hoook',
  data () {
    return {
      title: 'Hoook!'
    }
  },
  props: ['params'],
  mounted () {

  }

}
</script>
<style scoped>
.title-box{
  display: flex;
  flex-direction: row;
}
</style>
