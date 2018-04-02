<template>
 <div>
   <x-header :left-options="{backText: ''}">我的购物车<a slot="right" @click="editCart">{{isEdit ? '完成' : '编辑'}}</a></x-header>

   <div class="cart">
     <div class="cartItem flex-cart" v-for="(item,i) in products">
       <div class="flexItem-cart img">
         <check-icon :value.sync="item.check"> </check-icon>
         <img :src="item.imgs" />
       </div>
       <div class="flexItem-cart">
         <p>{{item.name}}</p>
         <p v-if="isEdit">
           <inline-x-number class="numberBox"  v-model="item.quantity" :value="item.quantity" :max="item.num"  :min="1" fillable></inline-x-number>
         </p>
         <p v-else class="price">{{item.price}}</p>
       </div>
       <div class="flexItem-cart flexItem-cart-right"><x-button @click.native="deleteProduct(i)" class="deleteBtn" v-if="isEdit">删除</x-button>
         <p v-else class="num">{{item.quantity}}</p></div>
     </div>

   </div>
   <div class="flex-cart footer">
     <div class="flexItem-cart" style="flex: 0.5;"> <check-icon :value.sync="selectAll">全选 </check-icon></div>
     <div class="flexItem-cart">
       <div class="flex-cart">
         <div class="flexItem-cart" v-if="!isEdit">合计：<span class="price">{{total}}</span></div>
         <div class="flexItem-cart"><x-button class="placeBtn" @click.native="placeOrder">{{isEdit ? '删除' : '结算'}}</x-button></div>

       </div>
     </div>
   </div>
 </div>

</template>
<script>
  import {XHeader, CheckIcon, XButton, InlineXNumber} from 'vux'
  import {specifiedMachine, getPrice} from '@/utils/helper'
//  const entry = localStorage.getItem('entry')
//  let cartLocal = entry === 'devices' || specifiedMachine() ? 'cart' : 'cartOnline'
  export default {
    components: {
      XHeader,
      CheckIcon,
      XButton,
      InlineXNumber
    },
    data () {
      return {
        value: true,
        products: [],
        selectAll: false,
        total: 0,
        isEdit: false,
        cartLocal: localStorage.getItem('entry') === 'devices' || specifiedMachine() ? 'cart' : 'cartOnline'
      }
    },
    mounted () {
     //  let cartLocal = entry === 'device' ? 'cartOnline' : 'cart'
      let cart = localStorage.getItem(this.cartLocal) ? JSON.parse(localStorage.getItem(this.cartLocal)) : []

      cart.map(item => {
        item.check = false
        item.price = getPrice(item.price)
      })
      this.products = cart
    },
    watch: {
      selectAll (val) {
        this.total = 0
        this.products.map(item => {
          item.check = val
          if (val) {
            this.total += parseFloat(item.price) * item.quantity
          }
        })
        this.total = this.total.toFixed(2)
      },
      products: {
        handler: function (newVal) {
          this.total = 0
          this.products.map(item => {
            if (item.check) {
              this.total += parseFloat(item.price) * item.quantity
            }
          })
          this.total = this.total.toFixed(2)
        },
        deep: true
      }
    },
    methods: {
      editCart () {
        this.isEdit = !this.isEdit
      },
      deleteProduct (i) {
        this.products.splice(i, 1)
        localStorage.setItem(this.cartLocal, JSON.stringify(this.products))
      },
      placeOrder () {
        let selectedProduct = []
        this.products.map(item => {
          if (item.check) {
            selectedProduct.push(item)
          }
        })
        if (selectedProduct.length === 0) {
          this.$vux.toast.show({type: 'cancel', text: '请选择商品'})
          return
        }
        if (this.isEdit) {
          let arrSelect = new Set(selectedProduct)
          let arrProduct = new Set(this.products)
          let differenceABSet = new Set([...arrProduct].filter(x => !arrSelect.has(x)))
          this.products = [...differenceABSet]
          localStorage.setItem(this.cartLocal, JSON.stringify(this.products))
        } else {
          localStorage.setItem('order', JSON.stringify(selectedProduct))
          this.$router.push('/micro/orderformOnline')
        }
      }
    }
  }
</script>
<style lang="less" scoped >
  .cart{
    background-color: #ffffff;
    padding-bottom: 86px;
  }
  .flex-cart{
    display: flex;
    align-items:center;
  }
.cartItem{
  border-bottom: 1px solid #ddd;
  padding: 15px;
  margin: 15px 0;
  font-size: 28px;
  .numberBox{
    margin-top: 15px;
  }
}

  .flexItem-cart{
    flex:1.5;
    &.img{
    flex: 0.8;
     }
     &.flexItem-cart-right{
        flex: 0.4;
        text-align: right;
      }
    img{
      width:120px;
      vertical-align: middle;
      border: 2px solid #ddd;
    }
  }
  .price{
    &:before{
    content: '￥';
     }
    color: #f00;
  }
  .num{
  &:before{
     content: '×';
   }
  color: #ccc;
  }
  .footer{
    position: fixed;
    bottom: 105px;
    width:100%;
    border-top:1px solid #dddddd;
    background-color: #ffffff;

  }
  button.deleteBtn{
    background-color: #ec544d;
    border-radius: 0;
    border-width: 0;
    color: #fff;
    font-size: 28px;
    padding: 0;
    line-height: 180px;
    margin-left: 15px;
  }
  button.placeBtn{
    background-color: #64b357;
    border-radius: 0;
    border-width: 0;
    color: #fff;
  }
</style>
