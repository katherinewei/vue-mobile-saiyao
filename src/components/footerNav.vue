<template>
  <tabbar style="position: fixed" v-show="showNav">
    <tabbar-item :selected="selectIndex == i"  :link="`/micro/${item.key}`" v-for="(item,i) in menu" :key="i">
      <img slot="icon" :src="item.icon">
      <img slot="icon-active" :src="item.selectIcon">
      <span slot="label">{{item.title}}</span>
    </tabbar-item>
  </tabbar>
</template>
<script>
  import {Tabbar, TabbarItem} from 'vux'
  import { mapState } from 'vuex'
  export default {
    components: {
      Tabbar,
      TabbarItem
    },
    data () {
      return {
      }
    },
    props: {
      'showNav': {
        type: Boolean,
        default: true
      },
      'selectIndex': {
        type: Number,
        default: 0
      }
    },
    computed: {
      ...mapState({
        menu: state => state.pageConfig.menu

      }),
      route () {
        return this.$route.path
      }
    },
    methods: {
      goBack () {
        this.$router.back()
      }
    }
  }
</script>
