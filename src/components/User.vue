<template>
  <div>
    <div class="bg">
      <div class="content">
        <p class="user"> {{user.nickname}}</p>
        <div class="photo"><div><img :src="user.header" /><i/></div></div>
        <div class="nav">
          <div>
            <router-link to="/micro/order" style="color:#000">
            <p>我的订单（个）</p>
            <p class="number">{{total}}</p>
          </router-link>
          </div>
          <div>
            <p>我的余额（元）</p>
            <p class="number">0.00</p>
          </div>
        </div>
      </div>
      </div>

    <div class="box">

      <group class="allOrder">

        <cell  title="我的订单" is-link  link="/order">
          <span class="all">查看全部订单 </span>
        </cell>
      </group>
      <grid :show-lr-borders="false" :show-vertical-dividers="false">
        <grid-item class="orderItem" v-for="(dataItem,i) in list" :key="i" :link="`/order?type=${dataItem.type}`" :label="dataItem.text">
          <i slot="icon" :class="`iconfont ${dataItem.icon}`"/>

        </grid-item>
      </grid>

    </div>
    <div class="list box">
      <cell is-link title="我的优惠券"></cell>
      <cell is-link title="我的积分"></cell>
  </div>

  </div>
</template>
<script>
  import URL from '@/modal/url'
  import {requestGet} from '@/modal/index'
  import {UserId} from '@/modal/validator'
  import {Cell, Group, Grid, GridItem} from 'vux'
  export default {
    components: {
      Cell,
      Group,
      Grid,
      GridItem
    },
    data () {
      return {
        user: {},
        total: 0,
        list: [{
          icon: 'icon-daifukuan',
          text: '待付款',
          type: 1
        }, {
          icon: 'icon-daishouhuo',
          text: '待收货',
          type: 5
        }, {
          icon: 'icon-yiwancheng',
          text: '已完成',
          type: 9
        }]
      }
    },
    mounted () {
      this.getUser()
      this.getOrder()
    },
    methods: {
      getUser: function () {
        const response = (res) => {
          this.user = res
        }
        const result = {url: URL.users, id: UserId(), response}
        requestGet(result)
      },
      getOrder: function () {
        const response = (res) => {
          this.total = res.total
        }
        const Categories = {url: URL.orders, response}
        requestGet(Categories)
      }
    }
  }
</script>
<style lang="less" scope>
@import "user.less";
</style>
