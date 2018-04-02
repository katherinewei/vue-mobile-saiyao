<template>
  <tabbar style="position: fixed" v-show="showNav">
    <tabbar-item :selected="selectIndex == i"  :link="`/${item.key}`" v-for="(item,i) in tabs" :key="i">
      <img slot="icon" :src="item.icon">
      <img slot="icon-active" :src="item.selectIcon">
      <span slot="label">{{item.title}}</span>
    </tabbar-item>
  </tabbar>
</template>
<script>
  import {Tabbar, TabbarItem} from 'vux'
  export default {
    components: {
      Tabbar,
      TabbarItem
    },
    data () {
      return {
        tabs: [
          {
            title: '店铺首页',
            key: 'micro',
            icon: require('../assets/staticIcon/homeUp.png'),
            selectIcon: require('../assets/staticIcon/homeDown.png')
          },
          {title: '机台自提',
            key: 'micro/market',
            icon: require('../assets/staticIcon/activityUp.png'),
            selectIcon: require('../assets/staticIcon/activityDown.png')
          },
          {
            title: '个人中心',
            key: 'user',
            icon: require('../assets/staticIcon/userUp.png'),
            selectIcon: require('../assets/staticIcon/userDown.png')
          }
        ]
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
