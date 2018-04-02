<template>


  <popup v-model="visible" height="100%">
   <div class="container" >


     <div class="navItemContainerStyle">
       <div class="navContentNearbyStyle">
         <img src="../assets/staticIcon/nearbyVendingLogo.png" class="nearbyVendingLogoStyle"/><span
         class="nearbyVendingTextStyle">最近使用</span>
       </div>
       <x-icon class="closeIcon" type="ios-close-outline" size="30" @click="closeModal"></x-icon>
     </div>

     <div class="wrap">
       <div v-if="historyDevices.length > 0">
         <div class="vendingInfoContentStyle" v-for="(device,i) in historyDevices" @click="onHandleClick(device)">
           <div class="imgContainerStyle">
             <img src="../assets/staticIcon/vendingLogo.png" alt="" class="imgStyle"/>
           </div>
           <div class="textContainerStyle">
             <div class="vendingNameTextStyle">
               {{device.area}}
             </div>
             <div class="addressTextStyle">{{device.address}}</div>

             <div class="distanceAndTextStyle">
               <span class="textStyle">N0. {{device.number}}</span>
               <span class="distanceTextStyle">{{device.distance}}</span>
             </div>

             <div class="nameTextStyle">
               商户名: {{device.name}}
             </div>
           </div>
         </div>
       </div>
       <div v-else>
         暂无数据
       </div>

     </div>

  <div class="navItemContainerStyle">
    <div class="navContentNearbyStyle">
      <img src="../assets/staticIcon/nearbyVendingLogo.png" class="nearbyVendingLogoStyle"/><span
      class="nearbyVendingTextStyle">附近机台</span>
    </div>
  </div>

  <div class="wrap">
    <div v-if="devices.length > 0">
     <div class="vendingInfoContentStyle" v-for="(device,i) in devices" @click="onHandleClick(device)">
      <div class="imgContainerStyle">
        <img src="../assets/staticIcon/vendingLogo.png" alt="" class="imgStyle"/>
      </div>
      <div class="textContainerStyle">
        <div class="vendingNameTextStyle">
          {{device.area}}
        </div>
        <div class="addressTextStyle">{{device.address}}</div>

        <div class="distanceAndTextStyle">
          <span class="textStyle">N0. {{device.number}}</span>
          <span class="distanceTextStyle">{{device.distance}}</span>
        </div>

        <div class="nameTextStyle">
          商户名: {{device.name}}
        </div>
      </div>
    </div>

    </div>
    <div v-else>
      暂无数据
    </div>
  </div>
  </div>
  </popup>
</template>
<script>
  import {setAccessDeviceId} from '../modal/validator'
  import { mapState, mapMutations } from 'vuex'
  import {Popup} from 'vux'
  export default {
    name: 'devices',
    props: ['devices', 'notPush'],
    components: {
      Popup
    },
    data () {
      return {
        historyDevices: []
      }
    },
    computed: {
      ...mapState({
        visible: state => state.device.visible
      })
    },
    mounted () {
      let history = localStorage.getItem('nearby_Devices')
      history = history ? JSON.parse(history) : []
      this.historyDevices = history
    },
    watch: {
      // 如果路由有变化，会执行该方法
      '$route': function () {
        const id = this.$route.params.id
        this.$store.dispatch('getItems', {id}).then(this.closeModal)
       // this.routeChange()
      }
    },
    methods: {
      ...mapMutations([
        'setDevicesModal',
        'setCurrentDevice'
      ]),
      onHandleClick: function (device) {
        let nearbyDevices = localStorage.getItem('nearby_Devices')
        setAccessDeviceId(device.object_id)
        if (!nearbyDevices) {
          let deviceItem = []
          deviceItem.push(device)
          localStorage.setItem('nearby_Devices', JSON.stringify(deviceItem))
          this.historyDevices = deviceItem
        } else {
          nearbyDevices = JSON.parse(localStorage.getItem('nearby_Devices'))
          let deviceItem = []
          deviceItem.push(device)
          for (let i in nearbyDevices) {
            if (nearbyDevices[i].object_id === device.object_id) {
            } else {
              deviceItem.push(nearbyDevices[i])
            }
          }
          if (deviceItem.length > 2) {
            deviceItem.pop()
          }
          localStorage.setItem('nearby_Devices', JSON.stringify(deviceItem))
          this.historyDevices = deviceItem
          if (!this.notPush) {
            this.$router.push({path: '/micro/market/' + device.object_id})
          }
          this.closeModal()
          this.setCurrentDevice({currentDevice: device})
        }
      },
      closeModal: function () {
        this.setDevicesModal({visible: false})
      }
    }
  }
</script>
<style lang="less">
  .closeIcon {
    fill: #ccc;
    position: absolute;
    right: 10px;
    top:10px;
  }

  .container{
    background-color: #fff;
    padding-bottom: 100px;
  }
  .wrap{

  }
  .addressContainerStyle {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #fff;
    height: 2.53333333rem;
  }


  .navItemContainerStyle {
    width: 100%;
    justify-content: center;
    align-items: center;
    height: 1rem;
    background-color: #fff;
    font-size: .21333333rem;
    text-align: left;
  }

  .navContentLatestStyle {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: .26666667rem;
    font-size: .4rem;
    color: #333333;
    background-color: #e6e6e6;
    width: 2.41333333rem;
    height: 1rem;
    border-radius: .30666667rem
  }

  .navContentNearbyStyle {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: .26666667rem;
    font-size: .4rem;
    color: #333333;
    width: 2.41333333rem;
    height: 1rem;
  }

  .vendingContainerStyle {
    display: flex;
    background-color: #fff;
    height: 2.50666667rem
  }

  .nearbyVendingLogoStyle {
    width: .62666667rem;
    height: .62666667rem;
    padding-right: .13333333rem
  }

  .nearbyVendingTextStyle {
    font-size: .4rem;
    color: #333333
  }

  .vendingInfoContentStyle {
    display: flex;
    align-items: center;
    height: 100%;

    border-top: 1px solid  #ddd;
    padding: 0.3rem;
  }

  .textContainerStyle {
    width: 100%;
    padding-left: 20px;
  }

  .imgContainerStyle {
    display: flex;
    width: 2rem;
  }

  .imgStyle {
    width: 1.33333333rem; /* 100px */
    height: 1.33333333rem; /* 100px */
    margin: 0 auto;
    padding-right: 20px;
  }

  .vendingNameTextStyle {
    color: #333333;
    padding-bottom: .26666667rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.4rem;

  }

  .addressTextStyle {
    font-size: .4rem;
    color: #999999;
    padding-bottom: 0.2rem;
  }

  .textStyle {
    font-size: 22px;
    color: #999999;
    border:2px solid #999;
    border-radius: 0.11111rem;
    padding:0 10px;

  }

  .nameTextStyle{
    font-size: .34rem;
    color: #999999;
    padding-top: 0.2rem;
  }

  .distanceTextStyle {
    font-size: .32rem;
    color: #47b34f;
    padding-left: 0.5rem;
    float: right;
    margin-right: 10px;
  }

  .distanceAndTextStyle {

  }

  .positionImgStyle {
    font-family: "iconfont" !important;
    font-size: .74666667rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #47b34f;
    padding-right: 0.34rem;
  }

  .devicesContent{
    text-align: center;
    padding: 20px 0;
    color: #666;
    background-color: #ffffff;
  span{

    font-size: 26px;
  //background-color: #ffffff;
  //border-radius: 5px;
  //padding:5px 15px;
  svg{
    vertical-align: middle;
    margin-left: 5px;
  }
  }

  }

</style>
