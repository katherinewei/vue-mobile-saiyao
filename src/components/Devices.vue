<template>
  <div>

   <showDevices :devices="devices" />
  </div>
</template>

<script>
  import URL from '@/modal/url'
  import {requestGet} from '@/modal/index'
  import {getAccessOperatorId, getAccessDeviceId} from '@/modal/validator'
  import showDevices from './showDevices.vue'
  import {mapMutations} from 'vuex'
  export default {
    components: {
      showDevices
    },
    data () {
      return {
        devices: []
      }
    },
    mounted () {
      this.getDevices()
    },
    methods: {
      ...mapMutations([
        'setCurrentDevice'
      ]),
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
        const id = currentDevice.object_id
        this.setCurrentDevice({currentDevice, devices})
        this.$router.push({path: '/micro/market/' + id})
      }
    }
  }
</script>

<style>

</style>
