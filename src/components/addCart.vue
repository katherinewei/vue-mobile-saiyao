<template>
  <popup v-model="cart.isShowAddCart" position="bottom" max-height="50%" style="overflow-y: inherit;background-color: #ffffff;">
    <div class="flex_cart">
      <div class="flexItem" style="flex:0.8">
        <div class="img">
          <img :src="cart.currentItem.imgs"/>
        </div>
      </div>
      <div class="flexItem" >
        <div class="text">
          <p class="name">{{cart.currentItem.name}}</p>
          <p class="price">{{(parseFloat( cart.currentItem.price) / 100).toFixed(2)}}</p>
          <p class="stock">库存：{{cart.currentItem.num}}</p>
        </div>
      </div>

    </div>
    <x-number class="numberBox" title="数量" v-model="cart.xNum" :value="cart.xNum" :max="cart.currentItem.num"  :min="1" @on-change="changeNum" fillable></x-number>
    <div>
      <x-button style="border-radius: 0" @click.native="onCartItemsClick" type="primary"> 确定 </x-button>
    </div>
  </popup>
</template>
<script>
  import {Popup, XButton, InlineXNumber, XNumber} from 'vux'
  import { mapState, mapMutations } from 'vuex'
  export default {
    components: {
      Popup,
      XButton,
      InlineXNumber,
      XNumber
    },
    computed: {
      ...mapState({
        cart: state => state.cart
//        currentItem: state => state.cart.currentItem,
//        cartNum: state => state.cart.cartNum,
//        xNum: state => state.cart.xNum,
//        type: state => state.cart.type
      })
    },
    props: ['market'],
    data () {
      return {

      }
    },

    methods: {
      ...mapMutations([
        'setCartModal',
        'setCartCurrentValue',
        'setCartNumber'
      ]),
      changeNum: function (value) {
        this.setCartCurrentValue({cartNum: value})
      },
      onCartItemsClick: function () {
        const entry = localStorage.getItem('entry')
        const devices = entry === 'devices'
        const {currentItem, cartNum, type} = this.cart
        let item = currentItem
        item.quantity = cartNum
        item.product_id = devices ? currentItem.object_id : currentItem.product_id
        item.stock = currentItem.num
        if (type === 'buy') {
          const order = [item]
          localStorage.setItem('order', JSON.stringify(order))
          let book = ''
          if (this.$route.query.book) {
            book = '?book=1'
          }
          let url = '/micro/orderformOnline' + book

          if (this.market) {
            url = '/micro/orderformOnline?marketing=1'
//            if(t == 'ordinary'){
//                url = '/micro/orderformOnline';
//                item.price = item.original_price
//            }
//            if(t == 'bulk'){
//              url = '/micro/orderformOnline?marketing=1&join='+item.object_id;
//            }
          }

          //  history.push(url)
          window.location.href = url
        } else {
          let flag = devices ? 'cart' : 'cartOnline'
          let cart = localStorage.getItem(flag)
          let data = []
          if (cart) {
            cart = JSON.parse(cart)
            let flag = true
            cart.map(item => {
              if (item.name === currentItem.name) {
                item.quantity = cartNum
                flag = false
              }
            })
            if (flag) {
              cart.push(item)
            }
            data = cart
          } else {
            data.push(item)
          }
          localStorage.setItem(flag, JSON.stringify(data))
          const cartInfo = {time: new Date().getTime(), source: entry}
          localStorage.setItem('cartTime', JSON.stringify(cartInfo))
          this.setCartCurrentValue({xNum: 1})
          this.setCartNumber({cartNumber: data.length})
          this.$vux.toast.show({
            text: '添加成功！'
          })
        }
        this.setCartModal({isShowAddCart: false})
      }
    }
  }
</script>
<style lang="less">
  @import "addCart.less";
</style>
