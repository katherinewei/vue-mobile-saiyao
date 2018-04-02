// import { UPDATECITY } from './type'
// import { mapMutations } from 'vuex'
import URL from '@/modal/url'
import {requestGet} from '@/modal/index'
import {getPrice} from '@/utils/helper'
// import Vue from 'vue'
export default {
  getItems ({ commit, state }, {id}) {
    console.log(id)
    const response = (res) => {
      let list = res.items
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

      commit('getItemsResponse', { items: list })
    }
    const products = {url: URL.devices_items, response, id}
    requestGet(products)
  }
}
