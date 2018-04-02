<template>
  <div>
    <!--<div class="devicesContent" ><span>{{currentDevice.name}}</span></div>-->

    <div class="devicesContent"  @click="onDevicesClick"><span>{{currentDevice.name}}</span> <x-icon type="ios-arrow-down" size="18"></x-icon></div>

    <ProductList :products="products" :onItemsClick="onItemsClick"/>
    <showDevices :devices="devices" />

    <CartNumber />
  </div>
</template>
<script>
  // import URL from '@/modal/url'
  // import {requestGet} from '@/modal/index'
  import ProductList from './productList.vue'
  // import {getPrice} from '@/utils/helper'
  import { mapState, mapMutations } from 'vuex'
  import showDevices from './showDevices.vue'
  import {getAccessDeviceId} from '@/modal/validator'
  import CartNumber from './cartNumber.vue'
  export default {
    components: {
      ProductList,
      showDevices,
      CartNumber
    },
    data () {
      return {
        // products: [],
        current: {}
      }
    },
    mounted () {
      this.getItems()
    },
    computed: {
      ...mapState({
        currentDevice: state => state.device.currentDevice,
        devices: state => state.device.devices,
        products: state => state.device.items
      })
    },
    methods: {
      ...mapMutations([
        'setDevicesModal',
        'setCurrentDevice',
        'setCartNumber'
      ]),
      getItems: function () {
        let locale = sessionStorage.getItem('nearby_Devices_service')
        if (locale) {
          let devices = JSON.parse(locale)
          this.getDevice(devices)
        }
        const id = this.$route.params.id
        this.$store.dispatch('getItems', {id})
      },
      onDevicesClick: function () {
        this.setDevicesModal({visible: true})
        this.setCartNumber({cartNumber: 0})
        localStorage.removeItem('cart')
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
        // this.devices = devices
        const id = currentDevice.object_id
        this.setCurrentDevice({currentDevice, devices})
        this.$router.push({path: '/micro/market/' + id})
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
.vux-x-icon{
  vertical-align: middle;
}
</style>
