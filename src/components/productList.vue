<template>

  <div class="product" v-if="products.length > 0">
    <div v-for="(item,i) in products" :key="item.object_id" class="cardItem">
      <div class="inner">
        <router-link :to="book ? `/detail?hotItem=1&book=1` :`/detail?id=${item.object_id}`" @click.native="toDetail(item)">
          <div

            :style="{ paddingBottom : '100%',overflow: 'hidden',height: 0,backgroundSize: '100% 100%',backgroundImage: `url(${item.imgs})`}"></div>
          <div class="name">
            <span>{{item.name}}</span>
            <p>
              <em><b class="priceIcon">价格：￥</b>{{item.priceArr[0]}}.<i
                class="pointNextPriceStyle">{{item.priceArr[1]}}</i> </em>
              <span>剩余：{{item.num}}</span>
            </p>
          </div>
        </router-link>
        <span v-if="!book" class="icon-gouwucheup positionImgStyle" @click="onItemsClick(item)"></span>
      </div>
      <div v-if="item.num <= 0" class="soldOut"><span>已售罄</span></div>
      <div v-if="item.label" class="rightIcon new">{{item.label}}</div>
    </div>
    <addCart />
  </div>
  <div v-else>
    <msg title="暂无商品" :icon="icon"></msg>
  </div>
</template>
<script>
  import addCart from './addCart.vue'
  import {Msg} from 'vux'
  export default {
    name: 'List',
    components: {
      addCart,
      Msg
    },
    data () {
      return {
        icon: 'info'
      }
    },
    props: ['products', 'onItemsClick', 'book'],
    mounted () {
    },
    methods: {
      toDetail: function (item) {
        if (this.book) {
          localStorage.setItem('hotItem', JSON.stringify(item))
        } else {
          localStorage.setItem('detailId', item.object_id)
        }
      }
    }
  }
</script>
<style lang="less">
  @import "productList.less";

</style>
