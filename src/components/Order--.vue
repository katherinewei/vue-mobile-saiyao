<template>
  <div>
    <!--<tab v-model="index" prevent-default @on-before-index-change="switchTabItem">-->
      <!--<tab-item  :key="index"  v-for="(tab,index) in tabs" >{{tab.title}}</tab-item>-->
    <!--</tab>-->
    <div id="mescroll">
      <div id="orderList"  v-cloak>
        <div  class='good-box' v-for="(item,i) in orders"   :key="item.shortSN">
          <div class='good-box-top'>
            <div class='good-box-top-l'>订单号：{{item.shortSN}}</div>
            <div class='good-box-top-r'>{{item.status==1||item.status==0?"待付款":""}}{{item.status==5?"未提货":""}}{{item.status==9?"已完成":""}}</div>
          </div>
          <div class='good-box-mid' v-for="(item0,n) in item.items" :key="n">
            <img v-if="item.isInvalid&&item.status==5" class='good-box-mid-invalid' />
            <img class='good-box-mid-l' :src='item0.img' />
            <div class='good-box-mid-m'>{{item0.name}}</div>
            <div class='good-box-mid-r'>
              <div class='good-box-mid-r-price'>¥{{item0.price_}}</div>
              <div class='good-box-mid-r-num'>×{{item0.quantity}}</div>
            </div>
          </div>
          <div class='good-box-bot'>
            <div class='good-box-bot-total'>共{{item.items.length}}件商品 合计：¥{{item.real_price_}}</div>
            <div v-if="item.status==1||item.status==0" :id="item" @click.native='payOrder' class='good-box-bot-btn active'>支付</div>
            <div v-if="item.status==1||item.status==0" :id="item" @click.native='delOrder' class='good-box-bot-btn'>删除</div>
            <div v-if="item.status==5" class='good-box-bot-l'>
              <div class='good-box-bot-top'>提货码：{{item.pick_number}}</div>
              <div class='good-box-bot-bot'>提货截止日期：{{item.invalid_at_}}</div>
            </div>
            <div v-if="item.status==5" :id="item" @click.native='qrCode' class='good-box-bot-btn'>二维码</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import URL from '@/modal/url'
  import {requestGet} from '@/modal/index'
//  import { Tab, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem, Scroller, Spinner } from 'vux'
  import {timeString, validator} from '@/utils/helper'
  import MeScroll from 'mescroll.js'
  export default {
//    components: {
//      Tab,
//      TabItem,
//      Sticky,
//      Divider,
//      XButton,
//      Swiper,
//      SwiperItem,
//      Scroller,
//      Spinner
//    },
    data () {
      return {
        orders: [],
        index: 0,
        tabs: [{title: '全部订单', status: -1}, {title: '待付款', status: 1}, {title: '待发货', status: 5}, {title: '已完成', status: 9}],
        page: 0,
        pages: 0,
        loading: false,
        status: -1,
        mescroll: null
      }
    },
    mounted () {
      var self = this
      self.mescroll = new MeScroll('mescroll', { // 请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
        up: {
          callback: self.upCallback, // 上拉回调
          // 以下参数可删除,不配置
          isBounce: false, // 此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
          page:{size:20}, // 可配置每页8条数据,默认10
          toTop: { // 配置回到顶部按钮
            src: '../assets/mescroll-totop.png'
            // html: null, // html标签内容,默认null; 如果同时设置了src,则优先取src
            // offset : 1000
          },
          empty: { // 配置列表无任何数据的提示
            warpId: 'orderList',
            icon: '../assets/mescroll-empty.png',
            tip: '亲,暂无相关数据哦~',
            btntext: '去逛逛 >',
            btnClick: function () {
              alert('点击了去逛逛按钮')
            }
          }
        }
      })
//      const payload = {that: this, index: 0}
//      this.getOrder({...payload})
    },
    methods: {
      getOrder: (data) => {

      },
      switchTabItem (index) {
        let status = this.tabs[index].status
        const payload = {that: this, index: index, status}
        this.getOrder({...payload})
      },
      upCallback (data) {
        console.log(data)
        // 联网加载数据
        var self = this
        this.loading = true
        const {that, index, status, page} = data
        const response = (res) => {
          const orders = res.orders

          orders.map(item => {
            item.shortSN = item.object_id.substring(0, 8)
            item.real_price_ = (item.real_price / 100).toFixed(2)
            if (item.invalid_at) {
              item.invalid_at_ = timeString(item.invalid_at)
            }
            item.isInvalid = validator(item.invalid_at)
            item.items.map(product => {
              product.price_ = (product.price / 100).toFixed(2)
              if (product.img) {
                if (product.img.endsWith('.jpg') || product.img.endsWith('.png')) {
                } else {
                  product.img = product.img + '-500x500.jpg'
                }
              }
            })
            return item
          })

          self.orders = res.orders
          if (index) {
            self.index = index
          }
          self.page = res.page
          self.pages = res.pages
          self.loading = false

          // 如果是第一页需手动制空列表 (代替clearId和clearEmptyId的配置)
          if (data.num === 1) {
            self.pdlist = []
          }
          // 更新列表数据
          self.pdlist = self.pdlist.concat(self.orders)
          self.mescroll.endByPage(self.page, self.pages) // 必传参数(当前页的数据个数, 总页数)
        }
        let payload = {}
        if (status && status !== -1) {
          payload.status = status
          that.state = status
        }
        if (data.num) {
          payload.page = data.num + 1
        }
        console.log(page)
        const orders = {url: URL.orders, payload, response}
        requestGet(orders)
      }
    }
  }
</script>

<style>
  @import './mescroll.min.css'
</style>
<style lang="less" scope>

  [v-cloak] {
    display: none;
  }
  .box2-wrap {
    /*height: 300px;*/
    overflow: hidden;
  }
  .rotate {
    display: inline-block;
    transform: rotate(-180deg);
  }
  .pullup-arrow {
    transition: all linear 0.2s;
    color: #666;
    font-size: 25px;
  }

  .good-box{
    border-bottom: 1px solid #eeeeee;
    background-color: #ffffff;
    margin-bottom: 10px;
  }
  .good-box-top{
    font-size: 24px;
    line-height: 24px;
    padding: 30px 20px;
    overflow: hidden;
  }
  .good-box-top-l{
    color: #999999;
    float: left;
  }
  .good-box-top-r{
    color: #64b357;
    float: right;
  }
  .good-box-mid{
    background-color: #fbfbfb;
    padding: 20px;
    overflow: hidden;
    position: relative;
  }
  .good-box-mid-invalid{
    position: absolute;
    left: 0;
    top: 0;
    width: 150px;
  }
  .good-box-mid-l{
    width: 150px;
    float: left;
    height: 150px;
  }
  .good-box-mid-m{
    float: left;
    font-size: 30px;
    color: #000;
    width: 420px;
    padding-left: 20px;
    box-sizing: border-box;
    word-break:break-all;
    display:-webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    overflow:hidden;
  }
  .good-box-mid-r{
    float: right;
    min-width: 140px;
    text-align: right !important;
  }
  .good-box-mid-r-price{
    color: #ea3425;
    font-size: 24px;
    line-height: 50px;
  }
  .good-box-mid-r-num{
    color: #666666;
    font-size: 24px;
    line-height: 50px;
  }
  .good-box-bot{
    padding-right: 20px;
    padding-bottom: 20px;
    overflow: hidden;
  }
  .good-box-bot-total{
    text-align: right;
    line-height: 60px;
    font-size: 24px;
    margin-bottom: 10px;
  }
  .good-box-bot-btn{
    width: 150px;
    height: 54px;
    border-radius: 5px;
    text-align: center;
    box-sizing: border-box;
    line-height: 50px;
    border: 1px solid #666666;
    color: #666666;
    font-size: 24px;
    float: right;
    margin-left: 20px;
  }
  .good-box-bot-btn.active{
    border: 1px solid #ec544d;
    color: #ec544d;
  }
  .no-good{
    margin-top: 260px;
    text-align: center;
  }
  .no-good-txt{
    margin-top: 28px;
    font-size: 24px;
  }
  .good-box-bot-l{
    margin-top: -20px;
    float: left;
    padding-left: 20px;
  }
  .good-box-bot-top{
    font-size: 26px;
  }
  .good-box-bot-bot{
    font-size: 24px;
    color: #666666;
  }
  .qrCode{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content:center;
    z-index: 999999999999;
    align-items:center;
  }
  .qrCode-box{
    background-color: #ffffff;
    border-radius: 10px;
    width: 85%;
    text-align: center;
    padding: 20px 0;
    position: relative;
  }
  .qrCode-box-local{
    width: 50px;
  }
  .qrCode-box-qr{
    width: 70%;
  }
  .qrCode-box-address{
    font-size: 30px;
    color: #666666;
    padding: 0 50px;
  }
  .qrCode-box-num{
    color: red;
    font-size: 34px;
  }
  .qrCode-box-tip{
    color: #999999;
    font-size: 26px;
    margin-top: 10px;
  }
  .qrCode-box-close{
    position: absolute;
    top: 0;
    right: 0;
    width: 80px;
    height: 70px;
    font-size: 40px;
    line-height: 70px;
    text-align: center;
    opacity: 0.5;
  }
  .no-good image{
    width: 70px;
  }
  .pay-mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 99999999;
  }
</style>
