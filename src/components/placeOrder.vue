<template>
  <div>
    <div v-if="items.length > 0" class="placeOrder">

      <div class="address" @click="chooseAddress">
        <div class="addressLeft">
          <div class="box">
            <img slot="icon"  src="../assets/staticIcon/position.png">
            <div v-if="book">
              <div v-if="currentDevice.number">
                <p>{{currentDevice.area}}</p>
                <p>{{currentDevice.address}}</p>
                <p>机台编号:{{currentDevice.number}}</p>
              </div>
              <div v-else>请选择附近机台</div>
            </div>
            <div v-else-if="isDevice">
                <p>请选择地址</p>
            </div>
            <div v-else>
              <p>{{device.area}}</p>
              <p>{{device.address}}</p>
              <p>机台编号:{{device.number}}</p>
            </div>
          </div>

        </div>
        <div class="addressRight">
          <x-icon type="ios-arrow-forward" size="20"></x-icon>
        </div>
      </div>

      <div class="content">
        <div class="product">
          <h3>我的商品</h3>
          <div class="product">
            <div class="item" v-for="(item,i) in items">
              <div class="flex">
                <div class="flexItem img">
                  <img :src="item.imgs"/>
                </div>
                <div class="flexItem name">
                  <p>{{item.name}}</p>
                </div>
                <div class="flexItem extra">
                  <p class="price">{{item.price}}</p>
                  <p class="num">{{item.quantity}}</p>
                </div>
              </div>
            </div>
          </div>
          <group class="extra_time">
            <datetime v-model="startTime" :start-date="startDate" format="YYYY-MM-DD HH:mm" :minute-list="['00', '15', '30', '45']" @on-change="change" title="送货开始时间" placeholder="请选择时间"></datetime>
            <datetime v-model="endTime"  placeholder="请选择时间"  format="YYYY-MM-DD HH:mm"  title="送货结束时间" :readonly="true"></datetime>
          </group>
          <div class="place">
            <div class="flex">
              <div class="flexItem" style="flex: 0.5;"></div>
              <div class="flexItem">
                <div class="flex">
                  <div class="flexItem">合计：<span class="price">{{total}}</span></div>
                  <div class="flexItem"><x-button class="placeBtn" @click.native="placeOrder">提交订单</x-button></div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      暂无下单商品
    </div>

    <div v-if="book">
      <showDevices :devices="devices" :notPush="true" />
    </div>
  </div>
</template>
<script>
  import {Cell, Datetime, XButton, Group} from 'vux'
  import {timeStringFormat, specifiedMachine} from '@/utils/helper'
  import {getAccessOperatorId, getAccessDeviceId} from '@/modal/validator'
  import URL from '@/modal/url'
  import {requestPost, requestGet} from '@/modal/index'
  import showDevices from './showDevices.vue'
  import { mapState, mapMutations } from 'vuex'
  const entry = localStorage.getItem('entry')
  export default {
    components: {
      Cell,
      Datetime,
      XButton,
      Group,
      showDevices
    },
    data () {
      return {
        items: [],
        startTime: timeStringFormat(Date.now() / 1000, 'yyyy-MM-dd hh:mm'),
        endTime: timeStringFormat((Date.now() / 1000 + 60 * 60 * 24), 'yyyy-MM-dd hh:mm'),
        startDate: timeStringFormat(Date.now() / 1000, 'yyyy-MM-dd'),
        total: 0,
        disable: false,
        book: false,
        isDevice: entry === 'device',
        device: {}
      }
    },
    computed: {
      ...mapState({
        devices: state => state.device.devices,
        currentDevice: state => state.device.currentDevice
      })
    },

    mounted () {
      this.book = this.$route.query && this.$route.query.book
      let order = localStorage.getItem('order')
      if (order) {
        order = JSON.parse(order)
        let {postponed} = order[0]
        const startTime = order[0].start_time
        const pickStartTime = order[0].pick_start_time
        const pickEndTime = order[0].pick_end_time
        if (startTime) {
          let now = Date.now()
          let nowDate = timeStringFormat(Date.now() / 1000, 'yyyy-MM-dd')
          let end = now
          let endDate = nowDate
          if (new Date('2017-08-01 ' + pickStartTime).getTime() >= new Date('2017-08-01 ' + pickEndTime).getTime()) {
            end = (Date.now() + (24 * 60 * 60 * 1000))
          }
          if (postponed) {
            nowDate = timeStringFormat((now + (postponed * 24 * 60 * 60 * 1000)) / 1000, 'yyyy-MM-dd')
            endDate = timeStringFormat((end + (postponed * 24 * 60 * 60 * 1000)) / 1000, 'yyyy-MM-dd')
          }
          let startPick = nowDate + ' ' + pickStartTime
          let endPick = endDate + ' ' + pickEndTime

          this.startTime = startPick
          this.endTime = endPick
        }
        this.items = order
        order.map(item => {
          let price = parseFloat(item.price)
          this.total += price * item.quantity
        })
        this.total = this.total.toFixed(2)
      }
      if (this.book) {
        this.getDevices()
      }
      if (!this.isDevice || specifiedMachine()) {
        const nearbyDevices = localStorage.getItem('nearby_Devices')
        const devices = nearbyDevices ? JSON.parse(nearbyDevices) : []
        devices.map((item) => {
          if (item.object_id === localStorage.getItem('access_deviceId')) {
            this.device = item
           // return
          }
        })
      }
    },
    methods: {
      ...mapMutations([
        'setDevicesModal',
        'setCurrentDevice'
      ]),
      chooseAddress: function () {
        this.setDevicesModal({visible: true})
      },
      clickItem: function (item) {
        this.setCurrentDevice({currentDevice: item})
      },
      change: function (value) {
        this.startTime = value
        this.endTime = timeStringFormat((new Date(value).getTime() / 1000 + 60 * 60 * 24), 'yyyy-MM-dd hh:mm')
      },
      placeOrder: function () {
        const {disable, items, currentDevice, startTime, endTime, book, isDevice} = this
        if (disable) {
          return
        }
        this.disable = true
        if (!startTime) {
          this.$vux.toast({type: 'cancel', text: '请选择送货时间'})
          return
        }
        const products = []
        items.map(item => {
          products.push({product_id: item.product_id, quantity: item.quantity})
        })
        const data = {
          items: products
        }
        if (book) {
          if (!currentDevice.number) {
            this.$vux.toast.show({type: 'cancel', text: '请选择机台'})
            return
          }
          data.device_id = currentDevice.object_id
          data.is_pre = 1
        }
        if (isDevice && !specifiedMachine()) {
//          if(now_address.length == 0){
//            Toast.fail('请填写收货地址');
//            //   return
//          }
         // data.delivery_address=now_address;
          data.operator_id = getAccessOperatorId()
          data.is_marketing = this.$route.query.marketing ? 1 : 0
        }
        if (!isDevice || specifiedMachine()) {
          data.device_id = getAccessDeviceId()
        }
        if (startTime) {
          data.pick_valid_at = parseInt(new Date(startTime).getTime() / 1000)
          data.pick_invalid_at = parseInt(new Date(endTime).getTime() / 1000)
        }
        if (this.$route.query.marketing) {
          data.is_marketing = 1
        }
        if (this.$route.query.join) {
          data.join = location.query.join
        }
        const url = isDevice && !specifiedMachine() && !book ? URL.store_orders : URL.orders
        const response = (data) => {
          this.disable = false
          let cartLocal = isDevice ? 'cartOnline' : 'cart'
          const response = (pay) => {
            let cart = localStorage.getItem(cartLocal) ? JSON.parse(localStorage.getItem(cartLocal)) : []
            let orderOnline = localStorage.getItem('order') ? JSON.parse(localStorage.getItem('order')) : []
            for (let i = 0, flag = true, len = cart.length; i < len; flag ? i++ : i) {
              for (let j = 0; j < orderOnline.length; j++) {
                if (cart[i] && cart[i].name && cart[i].name === orderOnline[j].name) {
                  cart.splice(i, 1)
                  flag = false
                } else {
                  flag = true
                }
              }
            }
            if (cart.length === 0) {
              localStorage.removeItem(cartLocal)
            } else {
              localStorage.setItem(cartLocal, JSON.stringify(cart))
            }
            localStorage.removeItem('order')
            if (pay.code) {
              this.$vux.toast({type: 'cancel', text: data.message})
            } else {
              window.location.href = pay.payUrl
            }
          }
          const result = {url: URL.ordersPay, payload: {order_id: data.object_id, redirect: 'https://shop.saiyaoyun.com/micro/order'}, response}
          requestPost(result)
        }
        console.log(data)
        const result = {url, payload: data, response}
        requestPost(result)
      },
      getDevices: function () {
        // const $this = this
        let locale = sessionStorage.getItem('nearby_Devices_service')
        if (locale) {
          let devices = JSON.parse(locale)
          this.getDevice(devices)
        } else {
          const responseWX = (data) => {
            let params = data.params
            this.$wechat.config({
              // debug: true,
              appId: params.appId,
              timestamp: params.timestamp,
              nonceStr: params.nonceStr,
              signature: params.signature,
              jsApiList: ['openLocation', 'getLocation']
            })
//          this.$wechat.ready(function () {
//            $this.$vux.toast.show({
//              text: '正在加载中',
//              type: 'text'
//            })
//            this.$wechat.getLocation({
//              type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
//              success: function (res) {
//                $this.$vux.toast.hide()
//                const latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
//                const longitude = res.longitude ; // 经度，浮点数，范围为180 ~ -180。
            const payload = {longitude: '113.333243', latitude: '22.995782', operator_id: getAccessOperatorId()}
            const url = URL.devices
            const response = (res) => {
              let devices = res.device
              sessionStorage.setItem('nearby_Devices_service', JSON.stringify(devices))
              this.getDevice(devices)

              // console.log(this.devices)
            }
            const result = {url, payload, response}
            requestGet(result)
//              }
//              fail: function (err) {
//                $this.$vux.toast.show({
//                  text: '位置服务被拒绝,请确保允许微信获取定位',
//                  type: 'text'
//                })
//                console.log(' ' + err)
//              }
//            })
//            this.$wechat.error(function (res) {
//              //  alert('wx error: ' + res);
//            })
//          })
          }
          requestGet({url: URL.wxsdk, payload: {url: encodeURI(window.location.href)}, response: responseWX})
        }
      },
      getDevice: function (devices) {
        const DeviceId = getAccessDeviceId()
        let currentDevice = devices[0]
        if (DeviceId) {
          devices.map(item => {
            if (item.object_id === DeviceId) {
              currentDevice = item
            }
          })
        }
        this.devices = devices
        // const id = currentDevice.object_id
        this.setCurrentDevice({currentDevice, devices})
      }
    }
  }
</script>
<style lang="less">
@import "placeOrder.less";
</style>
