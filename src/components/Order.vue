<template>
  <div>

    <tab id="navWarp" v-model="index" prevent-default @on-before-index-change="switchTabItem">
    <tab-item  :key="index"  v-for="(tab,index) in tabs" >{{tab.title}}</tab-item>
    </tab>
    <div id="mescroll" class="mescroll">
      <div id="orderList"  v-cloak>
        <div id="dataList"></div>
        <div   class='good-box' v-for="(item,i) in orders"   :key="item.shortSN">
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
            <div v-if="item.status==1||item.status==0" :id="item" @click='payOrder(item)' class='good-box-bot-btn active'>支付</div>
            <div v-if="item.status==1||item.status==0" :id="item" @click='delOrder(item)' class='good-box-bot-btn'>删除</div>
            <div v-if="item.status==5" class='good-box-bot-l'>
              <div class='good-box-bot-top'>提货码：{{item.pick_number}}</div>
              <div class='good-box-bot-bot'>提货截止日期：{{item.invalid_at_}}</div>
            </div>
            <div v-if="item.status==5" :id="item" @click='qrCode(item)' class='good-box-bot-btn'>二维码</div>
          </div>
        </div>

      </div>
    </div>
    <div v-transfer-dom>
      <confirm
        v-model="confirmDelete"
        :close-on-confirm="false"
        title="确定要删除？"
        @on-confirm="onDelete" >
      </confirm>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showQr" class="dialog-demo" hide-on-blur>
        <div class="Qr-box">
          <p>{{deviceArea}}<span>{{deviceAddress}}</span></p>
          <qrcode :value="selectItem.pick_number" type="img"></qrcode>
          <p>{{selectItem.pick_number}}</p>
          <p>扫描二维码提货</p>
        </div>
        <div @click="showQr=false">
          <span class="vux-close"></span>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import URL from '@/modal/url'
  import {requestGet, requestDelete, requestPost} from '@/modal/index'
  import {timeString, validator} from '@/utils/helper'
  import MeScroll from 'mescroll.js'
  import { Tab, TabItem, XButton, Confirm, XDialog, Qrcode, TransferDomDirective as TransferDom, Msg } from 'vux'

  export default {
    directives: {
      TransferDom
    },
    components: {
      Tab,
      TabItem,
      XButton,
      Confirm,
      XDialog,
      Qrcode,
      Msg
    },
    data () {
      return {
        orders: [],
        index: 0,
        tabs: [{title: '全部订单', status: -1}, {title: '待付款', status: 1}, {title: '待发货', status: 5}, {title: '已完成', status: 9}],
        loading: false,
        status: -1,
        mescroll: null,
        confirmDelete: false,
        selectItem: {},
        showQr: false,
        deviceAddress: '',
        deviceArea: ''
      }
    },
    mounted () {
      var self = this
      if (self.$route.query.type) {
        const type = parseInt(self.$route.query.type)
        self.status = type
      }
      self.mescroll = new MeScroll('mescroll', { // 请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
        up: {
          callback: self.upCallback, // 上拉回调
          // 以下参数可删除,不配置
          isBounce: false, // 此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
          page: {size: 20}, // 可配置每页8条数据,默认10
          toTop: { // 配置回到顶部按钮
            src: '../assets/mescroll-totop.png'
          },
          empty: { // 配置列表无任何数据的提示
            warpId: 'dataList',
            icon: '../../assets/mescroll-empty.png',
            tip: '亲,暂无订单~'
//            btntext: '去逛逛 >',
//            btnClick: function () {
//              alert('点击了去逛逛按钮')
//            }
          }
        }
      })
    },
    methods: {
      switchTabItem (index) {
        let status = this.tabs[index].status
        var navWarp = document.getElementById('navWarp')
        var minHight = this.mescroll.getClientHeight() - navWarp.offsetHeight
        document.getElementById('orderList').style.minHeight = minHight + 'px'
        this.status = status
        // 重置列表数据
        this.mescroll.resetUpScroll()
        this.index = index
      },
      upCallback (page) {
        let self = this
        self.tabs.map((item, i) => {
          if (item.status === parseInt(self.$route.query.type)) {
            self.index = i
          }
        })
        const pageNum = page.num
        self.loading = true
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

          self.loading = false
          if (page.num === 1) {
            self.orders = []
          }
          // 更新列表数据
          self.orders = self.orders.concat(orders)
          self.mescroll.endByPage(orders.length, res.pages) // 必传参数(当前页的数据个数, 总页数)
        }
        let payload = {}
        const {status} = self
        if (status && status !== -1) {
          payload.status = status
        }
        payload.page = pageNum
        const ordersData = {url: URL.orders, payload, response}
        requestGet(ordersData)
      },
      delOrder (item) {
        this.selectItem = item
        this.confirmDelete = true
      },
      onDelete () {
        const response = () => {
          this.$vux.toast.show({
            text: '删除成功'
          })
          this.confirmDelete = false
          this.orders.map((item, i) => {
            if (item.object_id === this.selectItem.object_id) {
              this.orders.splice(i, 1)
            }
          })
        }
        const ordersData = {url: URL.order, response, id: this.selectItem.object_id}
        requestDelete(ordersData)
      },
      payOrder (item) {
        this.selectItem = item
        this.$vux.loading.show({
          text: '正在跳转支付中...'
        })
        const response = (pay) => {
          this.$vux.loading.hide()
          window.location.href = pay.payUrl
        }
        const ordersData = {url: URL.ordersPay, payload: {order_id: item.object_id, redirect: 'https://shop.saiyaoyun.com/micro/order'}, response}
        requestPost(ordersData)
      },
      qrCode (item) {
        this.showQr = true
        this.selectItem = item
        const response = (res) => {
          this.deviceAddress = res.address
          this.deviceArea = res.area
        }
        const ordersData = {url: URL.device, id: item.device_id, response}
        requestGet(ordersData)
      }
    }
  }
</script>

<style>
  @import './mescroll.min.css'
</style>
<style>
  /*vue*/
  [v-cloak] {
    display: none;
  }
  /*mescroll滚动的区域*/
  .mescroll{
    position: fixed;
    top: 104px;
    bottom: 0;
    height: auto;
  }
  /*展示上拉加载的数据列表*/
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
  .Qr-box{

  }
</style>
