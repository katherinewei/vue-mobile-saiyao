import Vue from 'vue'
import Vuex from 'vuex'
import deviceMutations from './device/mutations'
import deviceAcions from './device/actions'
import cartMutations from './cart/mutations'
import detailAcions from './detail/actions'
import detailMutations from './detail/mutations'
import pageConfigMutations from './pageConfig/mutations'
Vue.use(Vuex)
const deviceGetters = {
  selectedDevice: state => state.currentDevice
}
const device = {
  state: {
    devices: [],
    currentDevice: {},
    visible: false,
    items: []
  },
  actions: deviceAcions,
  mutations: deviceMutations,
  getters: deviceGetters
}

const cartNumber = () => {
  const entry = localStorage.getItem('entry')
  let cartLocal = entry === 'device' ? 'cartOnline' : 'cart'
  let cart = localStorage.getItem(cartLocal) ? JSON.parse(localStorage.getItem(cartLocal)) : []
  return cart.length
}

const cart = {
  state: {
    isShowAddCart: false,
    currentItem: {},
    cartNum: 0,
    xNum: 1,
    type: 'cart',
    cartNumber: cartNumber()
  },
  mutations: cartMutations
}

const detail = {
  state: {
    item: {},
    activityStatus: 1,
    startTime: '',
    endTime: ''
  },
  actions: detailAcions,
  mutations: detailMutations
}

const pageConfig = {
  state: {
    menu: []
  },
  mutations: pageConfigMutations
}

const store = new Vuex.Store({
  modules: {
    device,
    cart,
    detail,
    pageConfig
  }
})

store.registerModule('vux', {
  state: {
    isLoading: false
  },
  mutations: {
    updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading
    }
  }
})

export default store
