<template>
  <router-link to="/micro/cart" class="cartNumber">
    <b class="iconfont icon-gouwucheup"><badge v-if="cart != 0" :text="cart"></badge></b>
  </router-link>
</template>
<script>
  import {Badge} from 'vux'
  import { mapState, mapMutations } from 'vuex'
  import {specifiedMachine} from '@/utils/helper'
  export default {
    components: {
      Badge
    },
    data () {
      return {
      }
    },
    computed: {
      ...mapState({
        cart: state => state.cart.cartNumber
      })
    },
    mounted () {
      const cartLocal = localStorage.getItem('entry') === 'devices' || specifiedMachine() ? 'cart' : 'cartOnline'
      let cart = localStorage.getItem(cartLocal) ? JSON.parse(localStorage.getItem(cartLocal)) : []
      this.setCartNumber({cartNumber: cart.length})
    },
    methods: {
      ...mapMutations([
        'setCartNumber'
      ])
    }
  }
</script>
<style lang="less" scope>
.cartNumber{
  position: fixed;
  bottom: 150px;
  right:-40px;
  color: #ffffff ;
  background-color: rgba(131,221,45, .3);
  border-radius: 50%;
  width:100px;
  height:100px;
  line-height: 110px;
  text-align: center;
  font-size: 70px;
  z-index: 9;
  b{
    font-size: 70px;
    font-weight: normal;
  }
  span{
    position: absolute;
    left:0;
    top:0;
    background-color: #47b34f;
  }
}
</style>
