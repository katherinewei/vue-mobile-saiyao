<template>
  <div class="List">
    <div v-for="(item , i) in filteredResultsDiscount" :key="item.product_id" class="item SecondKill">
      <router-link :to='`/detail/?id=${item.object_id}&activity=SecondKill`' @click.native="toDetail(item)" >
        <div class="img"><img :src="item.img"/></div>
        <div class="detail">
          <div class="txt">
            <p class="name">{{item.name}}</p>
            <p class="price">秒杀价：￥<b>{{item.price}}</b>
            </p>
          </div>
          <div class="buy">
            <span class="buyBtn">立即秒杀</span>
          </div>
        </div>
        <div class="badgeRob">秒杀</div>
      </router-link>
    </div>
  </div>

</template>
<script>
  import {getPrice} from '@/utils/helper'
  export default {
    data () {
      return {
        filteredResultsDiscount: []
      }
    },
    props: ['items'],
    mounted () {
      const {product} = this.items
      let filteredResultsDiscount = []
      if (product) {
        product.map(item => {
          if (item.img.endsWith('.jpg') || item.img.endsWith('.png')) {
          } else {
            item.img = item.img + '-500x500.jpg'
          }
          item.num = item.stock
          item.price = getPrice(item.price)
          return item
        })
        filteredResultsDiscount = product.filter(item => item.stock)
        product.map(item => {
          if (!item.stock) {
            filteredResultsDiscount.push(item)
          }
        })
        this.filteredResultsDiscount = filteredResultsDiscount
      }
    },
    methods: {
      toDetail: function (item) {
        localStorage.setItem('detailId', item.object_id)
      }
    }
  }
</script>
<style lang="less" scoped>
@import "activity.less";
</style>
