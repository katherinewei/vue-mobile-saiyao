<template>
  <div class="notFound">

    <div class="bg"></div>
    <div class="content"><p><b>SORRY</b></p><p>页面报错啦！</p><p>您访问的页面已离开地球</p><x-button @click.native="goBack">返回上一页</x-button></div>
  </div>
</template>
<script>
  import {Cell, XButton} from 'vux'
  export default {
    components: {
      Cell,
      XButton
    },
    data () {
      return {}
    },
    methods: {
      goBack: function () {
        this.$router.go(-1)
      }
    }
  }
</script>
<style lang="less">
  html,body,#app{
    height:100%;
  }
  .notFound{
    background-color: #e1f8fe;
    height: 95%;
    padding-top: 5%;
  .bg{
    background: url("../assets/staticIcon/404.png")  no-repeat center;
    background-size: 100%;
    width:100%;
    height: 6.5rem;

  }
  .content{
    text-align: center;
    font-size: 36px;
    line-height: 60px;
  button{
    width:auto;
    background-color: #e1574c;
    color: #fff;
    border-color: #e1574c;
    margin-top: .5rem;
    padding:0 .5rem;
    line-height: .9rem;
    height: .9rem;
  }
  }
  }
</style>
