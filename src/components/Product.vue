<template>
  <div>
    产品详情
  </div>
</template>

<script>
  import URL from '@/modal/url'
  import {requestGet} from '@/modal/index'
  import {getAccessDeviceId, getAccessOperatorId} from '@/modal/validator'
  import {specifiedMachine} from '@/utils/helper'
  export default {

    data () {
      return {
        itemProduct: {},
        marketing: []
      }
    },
    mounted () {
      this.getProduct()
    },
    methods: {
      getProduct: function () {
        let url = URL.devices_items
        const entry = localStorage.getItem('entry')
        let isMicro = entry === 'device'
        let deviceId = getAccessDeviceId()
        let productId = this.$route.query.id
        let id = deviceId
        let payload = {product_id: productId}
        let market = this.$route.query.activity
        isMicro = isMicro && !specifiedMachine()
        if (isMicro || market) {
          id = productId
          payload = {operator_id: getAccessOperatorId()}
          if (isMicro) {
            url = URL.store_product
          } else {
            url = URL.store_marketing
          }
        }
        const response = (res) => {
          this.itemProduct = isMicro || market ? res : res.items[0]
          if (market && market === 'bulk') {
            this.getMarketingDetail(productId)
          }
        }
        const result = {url, payload, id, response}
        requestGet(result)
      },
      getMarketingDetail: (id) => {
        const response = (res) => {
          this.marketing = res
        }
        const Categories = {url: URL.store_group_buy, payload: {operator_id: getAccessOperatorId(), marketing_id: id}, response}
        requestGet(Categories)
      }
    }
  }
</script>

<style>

</style>
