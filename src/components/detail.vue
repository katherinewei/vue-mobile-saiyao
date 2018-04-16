<template>
  <div >
    <div v-if="item.product_id || item.object_id">
      <img
        :src="item.imgs"
        alt=""
        style="width: 100%; vertical-align:top;display:block"
      />
      <div :class="this.$route.query.activity ? 'detailTile' : 'o_detailTile' ">
        <div v-if="this.$route.query.activity" class="flexDetail">
          <p class="price"><b
            class="priceIcon">￥</b>{{item.price}}<span>原价<br/><del>￥{{item.original_price}}</del></span>
          </p>
          <div class="time">
            <div>
              <p>
                <b>{{activityStatus == 1 ? '进行中' : activityStatus == 0 ? '已结束' : '未开始'}}</b>
                <em>{{activityStatus == -1 ? '距开始还有' : activityStatus == 1 ? '距结束还有' : '结束时间'}} </em>
              </p>
              <p v-if="activityStatus == -1">
                <clocker :time="startTime"></clocker>
              </p>

              <p v-if="activityStatus == 1">
                <clocker :time="endTime"></clocker>
              </p>
              <p v-if="activityStatus == 0">
                <b>{{endTime}}</b>
              </p>
            </div>
          </div>
        </div>

        <div class="detail_introduce">
          <div class="o_introduce flex">
            <div class="flexItem"><h3>{{item.name}}</h3></div>
            <div class="stock flexItem" >剩余：{{item.num}}</div>
          </div>
          <div class="o_price">
            <p v-if="!this.$route.query.activity"><span>{{item.price}}</span></p>
            <p>运费：免运费</p>
          </div>
          <div v-if="item.start_time" class="buy_time">
            <p>购买时段：{{item.start_time}} ~ {{item.end_time}}</p>
          </div>
        </div>
      </div>
      <div class="title">商品详情</div>
      <div class="detailDesc">
      <div>{{item.desc}}</div>
    </div>
      <div class="Footer">
        <div class="flex">
          <div class="flexItem">
            <div class="flex">
              <div class="flexItem linkBtn noMargin bordeRight"><router-link  :to="urlHome" ><i class="iconfont icon-zhuyeup positionIconStyle"/> </router-link></div>
              <div class="flexItem linkBtn noMargin"><router-link  to="/micro/cart"><i  class="positionIconStyle icon-gouwucheup iconfont" style="position: relative"><badge class="badge" :text="cartNumber"  /></i></router-link></div>
            </div>
        </div>
        <div v-if="!(this.$route.query.book || this.$route.query.activity)" @click="onItemsClick('cart')"  class="cartBtn  button noMargin flexItem">加入购物车 </div>
          <div @click="onItemsClick('buy')"  class="buyBtn  button  noMargin flexItem">立即购买</div>
        </div>
      </div>
      <addCart :market="this.$route.query.activity" />
    </div>
    <div v-else>
      <msg title="商品已下架" icon="info" :buttons="buttons"> </msg>
    </div>
  </div>
</template>
<script>
  import {mapState, mapMutations} from 'vuex'
  import {Badge, XButton, Clocker, Msg} from 'vux'
  import addCart from './addCart.vue'
  import {getAccessDeviceId} from '@/modal/validator'
  import {specifiedMachine, timeStringFormat} from '@/utils/helper'
  export default {
    components: {
      Badge,
      XButton,
      addCart,
      Clocker,
      Msg
    },
    data () {
      return {
        cartNum: 0,
        urlHome: '/micro',
        buttons: [{
          type: 'primary',
          text: '返回',
          onClick: this.goBack.bind(this)
        }]
      }
    },
    mounted () {
      this.getProduct()
      let urlHome = '/micro'
      if (localStorage.getItem('entry') === 'devices') {
        urlHome = '/micro/market/' + getAccessDeviceId()
      }
      if (specifiedMachine()) {
        urlHome = '/micro/?deviceId=' + getAccessDeviceId() + '&fixed=1'
      }
      this.urlHome = urlHome
    },
    computed: {
      ...mapState({
        cartNumber: state => state.cart.cartNumber,
        item: state => state.detail.item,
        activityStatus: state => state.detail.activityStatus,
        startTime: state => state.detail.startTime,
        endTime: state => state.detail.endTime
      })
    },
    methods: {
      ...mapMutations([
        'setCartModal',
        'setCartCurrentValue'
      ]),
      goBack () {
        this.$router.go(-1)
      },
      getProduct: function () {
        const productId = this.$route.query.id
        const market = this.$route.query.activity
        this.$store.dispatch('getItem', {productId, market})
      },
      onItemsClick: function (type) {
        const {item, activityStatus} = this
        const cart = localStorage.getItem('cart')

        if (item.start_time) {
          const now = new Date()
          let nowDate = timeStringFormat(Date.now() / 1000, 'yyyy/MM/dd')
          if (new Date(nowDate + ' ' + item.start_time) > now || new Date(nowDate + ' ' + item.end_time) < now) {
            this.$vux.toast.show({
              text: '不在购买时段！',
              type: 'cancel'
            })
            return
          }
        }

        if (cart && JSON.parse(cart).length > 9) {
          this.$vux.toast.show({
            text: '购物车不得多于10件商品！',
            type: 'cancel'
          })
          return
        }
        if (item.stock <= 0) {
          this.$vux.toast.show({
            text: '库存不足！',
            type: 'cancel'
          })
          return
        }
        if (activityStatus === -1) {
          this.$vux.toast.show({
            text: '活动未开始！',
            type: 'cancel'
          })
          return
        }
        if (activityStatus === 0) {
          this.$vux.toast.show({
            text: '活动已结束！',
            type: 'cancel'
          })
          return
        }

      //  }
        this.setCartModal({isShowAddCart: true})
        this.setCartCurrentValue({currentItem: item, type})
      }
    }
  }
</script>
<style lang="less" scope>
@import "detail.less";
</style>
