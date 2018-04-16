<template>
  <div id="app">
    <loading v-model="isLoading"></loading>
    <div class="container"><router-view></router-view></div>
    <footer-nav :showNav="showNav" :selectIndex="selectIndex"></footer-nav>

  </div>
</template>

<script>
  import { Loading } from 'vux'
  import { mapState } from 'vuex'
  import FooterNav from './components/footerNav.vue'
  export default {
    name: 'app',
    data () {
      return {
        showNav: true,
        selectIndex: 0
      }
    },
    components: {
      FooterNav,
      Loading
    },
    computed: {
      ...mapState({
        isLoading: state => state.vux.isLoading
      })
    },
    watch: {
      // 如果路由有变化，会执行该方法
      '$route': function () {
        this.routeChange()
      }
    },
    methods: {
      routeChange () {
        let path = this.$route.path
        if (path === '/micro' || path === '/micro/home' || path === '/micro/market' || path.indexOf('/micro/market/') > -1 || path === '/micro/user' || path === '/micro/cart') {
          this.showNav = true
          if (path === '/micro' || path === '/micro/home') {
            this.selectIndex = 0
            localStorage.setItem('entry', 'device')
          } else if (path === '/micro/market' || path.indexOf('/micro/market/') > -1) {
            this.selectIndex = 1
            localStorage.setItem('entry', 'devices')
          } else if (path === '/micro/user') {
            this.selectIndex = 2
          }
        } else {
          this.showNav = false
        }
      }
    },
    created () {
      this.routeChange()
    },
    mounted () {
      window.setTimeout(() => {
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      }, 250)
    }
  }
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import url('//at.alicdn.com/t/font_215607_8sb74x37206hia4i.css');
body {
  background-color: #f4f4f4;
}
.container{
  padding-bottom: 50px;
}
  a{
    text-decoration: none;
  }
</style>
