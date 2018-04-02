<script src="../../../../saiyao2/mall-mini-program/pages/index/index.js"></script>
<template>
  <div>
    <!--<Banner :banners="banner" auto ></Banner>-->
    <div  v-for="(item,index) in page">
      <div v-if="item.type == 'banner'">
       <Banner :item="item"/>
      </div>

      <div v-if="item.type == 'title'" :class="'subTitle ' + (!item.subTitle && 'subTitle2')">
        {{item.title}}<span>{{item.subTitle}}</span>
      </div>

      <div  v-if="item.type == 'products'">

        <div lock-y :scrollbar-x=true class="categories">
          <ul v-cloak>
            <li :class="'cate '+ (!currentCategoryId && 'active')" @click="handleCate">
              <div> <i class="iconfont icon-shuiguo" style="color: #fff;"></i><div>全部</div></div>
            </li>
            <li  @click="handleCate({id:item.object_id})" :class="'cate '+ (currentCategoryId == item.object_id && 'active')" v-for="(item) in category" :key="item.object_id">
              <div>{{item.name}}</div>
            </li>
          </ul>
        </div>

        <div class="box newActivity">
          <div v-if="!specifiedMach" class="tabs">
            <div :key="i" :class="'tab ' + (i == currentSort && 'active')" v-for="(item,i) in tabs"
            @click="handleTabClick(i)"><span :class="i == 1 && 'priceTab ' + (isPriceStatus && (priceStatus ? 'priceTab0' : 'priceTab1'))">{{item.title}}</span>
             </div>
          </div>
          <ProductList :products="products" :onItemsClick="onItemsClick"/>
          </div>
      </div>

      <div  v-if="item.type == 'preProduct'">
        <div  class="subTitle">预售商品<span>open to booking commodity</span></div>
        <ProductList :products="preProduct" :onItemsClick="onItemsClick" :book="true"/>
      </div>

      <div  v-if="item.type == 'historyHot'">
        <div  class="subTitle">历史爆款<span>History hot style</span></div>
        <div class="hotHistoryList">
          <div  v-if="hotItems.length > 0">
            <div v-for="(item,i) in hotItems" class="item" :key="item.object_id">
              <div class="inner">
                <router-link :to="`/detail?hotItem=1`" @click.native="toDetail(item)">
                  <div class="img">
                    <img :src="item.imgs"/>
                  </div>
                  <div class="name">

                    <p class="name">{{item.name}}</p>
                    <p class="price">{{item.price}}<span v-if="item.label" class="hot">{{item.label}}</span></p>

                  </div>
                </router-link>
                <span class="icon-gouwucheup positionImgStyle" @click="onItemsClick(item)"></span>
              </div>
            </div>
          </div>
          <div v-else>
            <msg title="暂无商品" icon="info"></msg>
          </div>
        </div>
      </div>
      <div v-if="item.type == 'secondKill'">
          <secondKill :items="item"/>
      </div>
      <div v-if="item.type == 'spellGroup'">
        <spellGroup :items="item"/>
      </div>
    </div>

    <addCart />
    <CartNumber />
  </div>
</template>

<script>
  import URL from '@/modal/url'
  import {requestGet} from '@/modal/index'
  import {getAccessOperatorId, setAccessOperatorId} from '@/modal/validator'
  import {Swiper, SwiperItem, Popup, XButton, InlineXNumber, Msg} from 'vux'
  import Banner from './banner.vue'
  import ProductList from './productList.vue'
  import addCart from './addCart.vue'
  import CartNumber from './cartNumber.vue'
  import secondKill from './secondKill.vue'
  import spellGroup from './spellGroup.vue'
  import {getPrice, specifiedMachine} from '@/utils/helper'
  import {mapMutations} from 'vuex'
  export default {
    components: {
      Swiper,
      SwiperItem,
      Banner,
      ProductList,
      Popup,
      XButton,
      InlineXNumber,
      addCart,
      CartNumber,
      secondKill,
      spellGroup,
      Msg
    },
    data () {
      return {
        banner: [],
        bannerList: [],
        page: [],
        category: [],
        products: [],
        hotItems: [],
        preProduct: [],
        currentSort: 0,
        isPriceStatus: false,
        priceStatus: false,
        currentCategoryId: '',
        isShowAddCart: false,
        currentItem: {},
        cartNum: 0,
        xNum: 1,
        tabs: [
          { title: '最新' },
          { title: '价格' }
        ],
        specifiedMach: specifiedMachine()
      }
    },

    mounted () {
      if (this.$route.query.oid) {
        setAccessOperatorId(this.$route.query.oid)
      }
      this.getPage()
    },
    methods: {
      getPage: function () {
        const $this = this
        let operatorId = getAccessOperatorId()
        if (!operatorId) {
          operatorId = '836ed2a4eb534ba7a4e79df2bd61c959'
          setAccessOperatorId(operatorId)
        }
        const payload = {operator_id: getAccessOperatorId()}
        const url = URL.store_page
        const response = (data) => {
          let pageConfig = data.page
          let page = pageConfig && pageConfig !== 'object' && JSON.parse(pageConfig)
          page = page instanceof Array ? page : []
          $this.page = page
          const products = page.filter(item => item.type === 'products')
          const historyHot = page.filter(item => item.type === 'historyHot')
          const preProduct = page.filter(item => item.type === 'preProduct')

          if (products.length > 0) {
            this.getCategories()
            this.getStoreProducts(payload)
          }
          if (historyHot.length > 0) {
            this.getHistoryHot(payload)
          }
          if (preProduct.length > 0) {
            this.getPreProduct(payload)
          }
        }
        const result = {url, payload, response}
        requestGet(result)
      },
      getCategories: function () {
        const response = (res) => {
          this.category = res.categories
        }
        const Categories = {url: URL.categories, response}
        requestGet(Categories)
      },
      getStoreProducts: function (payload, index) {
        const $this = this
        const response = (res) => {
          let list = res.results
          list.map(function (items) {
            if (items.img.endsWith('.jpg') || items.img.endsWith('.png')) {
              items.imgs = items.img
            } else {
              items.imgs = items.img + '-200x200.jpg'
            }
            items.priceArr = getPrice(items.price).toString().split('.')
            items.num = items.stock
            return items
          })
          $this.products = res.results
         // $this.index = index
          console.log($this.index)
        }
        payload.operator_id = getAccessOperatorId()
        const products = {url: URL.store_products, payload, response}
        requestGet(products)
      },
      getHistoryHot: function (payload) {
        const response = (res) => {
          let list = res.results
          list = list.map(function (items) {
            if (items.img.endsWith('.jpg') || items.img.endsWith('.png')) {
              items.imgs = items.img
            } else {
              items.imgs = items.img + '-200x200.jpg'
            }
            items.price = getPrice(items.price)
            items.num = items.stock
            return items
          })
          this.hotItems = list
        }
        const storeHot = {url: URL.store_hot, payload, response}
        requestGet(storeHot)
      },
      getPreProduct: function (payload) {
        const $this = this
        const response = (res) => {
          let list = res.results
          list.map(function (items) {
            if (items.img.endsWith('.jpg') || items.img.endsWith('.png')) {
              items.imgs = items.img
            } else {
              items.imgs = items.img + '-200x200.jpg'
            }
            items.priceArr = getPrice(items.price).toString().split('.')
            items.num = items.stock
            return items
          })
          $this.preProduct = res.results
        }
        const preProduct = {url: URL.store_pre, payload, response}
        requestGet(preProduct)
      },
      handleCate: function ({id, orderBy, asc, page}) {
        const $this = this
        this.currentCategoryId = id
        let payload = {
          operator_id: getAccessOperatorId()
        }
        if (page) {
          payload.page = page
        }
        if (id) {
          payload.category_id = id
        }
        if (orderBy) {
          payload.order_by = orderBy
          if (asc) {
            payload.asc = asc
          }
        }
        const response = (res) => {
          let list = res.results
          list.map(function (items) {
            if (items.img.endsWith('.jpg') || items.img.endsWith('.png')) {
              items.imgs = items.img
            } else {
              items.imgs = items.img + '-200x200.jpg'
            }
            items.priceArr = getPrice(items.price).toString().split('.')
            items.num = items.stock
            return items
          })
          $this.products = res.results
          // $this.index = index
        }
        const result = {url: URL.store_products, payload, response}
        requestGet(result)
      },
      handleTabClick: function (i) {
        const {currentCate, currentCategoryId, priceStatus} = this
        this.currentSort = i
        if (i === 1) {
          const data = {
            index: currentCate,
            category_id: currentCategoryId,
            orderBy: 'price'
          }
          if (!priceStatus) {
            data.asc = 1
          }
          sessionStorage.setItem('product_search_condition', JSON.stringify(data))
         // dispatch({type:'shop/fetchCategoriesItems',...data});
          this.getStoreProducts(data)
          this.isPriceStatus = true
          this.priceStatus = !priceStatus
         // dispatch({type:'shop/setStatus',isPriceStatus:true,priceStatus:!priceStatus});
        } else {
          const data = {
            index: currentCate,
            category_id: currentCategoryId
          }
          this.isPriceStatus = false
          this.getStoreProducts(data)
          // dispatch({type:'shop/setStatus',isPriceStatus:false});
         // dispatch({type:'shop/fetchCategoriesItems',...data});
        }
      },
      toDetail: function (item) {
        console.log(item)
        localStorage.setItem('hotItem', JSON.stringify(item))
      },
      ...mapMutations([
        'setCartModal',
        'setCartCurrentValue'
      ]),
      onItemsClick: function (item) {
        const cart = localStorage.getItem('cart')
        if (cart && JSON.parse(cart).length > 9) {
          this.$vux.toast.show({
            text: '购物车不得多于10件商品！',
            type: 'cancel'
          })
          return
        }
        // console.log(this.setCartModal())
        this.setCartModal({isShowAddCart: true})
        this.setCartCurrentValue({currentItem: item})
      }
    }
  }
</script>

<style lang="less">
  @import "banner.less";
  @import "title.less";
  @import "productList.less";

  @import "HistoryHot.less";
</style>

