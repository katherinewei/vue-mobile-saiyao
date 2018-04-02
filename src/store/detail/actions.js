// import { UPDATECITY } from './type'
// import { mapMutations } from 'vuex'
import {getAccessDeviceId, getAccessOperatorId} from '@/modal/validator'
import URL from '@/modal/url'
import {requestGet} from '@/modal/index'
import {getPrice, specifiedMachine, timeStringFormat} from '@/utils/helper'
// import Vue from 'vue'
export default {
  getItem ({ commit, state }, {productId, market}) {
    const response = (res) => {
      let item = res.items ? res.items[0] : res
      if (item.img.endsWith('.jpg') || item.img.endsWith('.png')) {
        item.imgs = item.img
      } else {
        item.imgs = item.img + '-200x200.jpg'
      }
      item.price = getPrice(item.price)
      item.original_price = getPrice(item.original_price)
      item.num = item.stock
      let activityStatus = 1
      const formatTime = Date.now() / 1000

      if (formatTime >= res.end) {  // 结束
        activityStatus = 0
      }
      if (formatTime < res.start) {  // 未开始
        activityStatus = -1
      }
      const startTime = timeStringFormat(res.start, 'yyyy/MM/dd hh:mm:ss')
      const endTime = timeStringFormat(res.end, 'yyyy/MM/dd hh:mm:ss')
      commit('getItemResponse', { item, activityStatus, startTime, endTime })
    }
    if (productId) {
      let payload = {product_id: productId}
      let id = getAccessDeviceId()
      const entry = localStorage.getItem('entry')
      let url = URL.devices_items

      let isMicro = entry === 'device'

      isMicro = isMicro && !specifiedMachine()
      if (isMicro || market) {
        payload = {operator_id: getAccessOperatorId()}
        id = productId
        if (isMicro) {
          url = URL.store_product
        }
        if (market) {
          url = URL.store_marketing
        }
      }
      const products = {url, response, payload, id}
      requestGet(products)
    } else {
      const res = JSON.parse(localStorage.getItem('hotItem'))
      response(res)
    }
  }
}
