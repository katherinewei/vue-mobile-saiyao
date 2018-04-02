import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/Index'
import Devices from '@/components/Devices'
import User from '@/components/User'
import Detail from '@/components/detail'
import Order from '@/components/Order'
import List from '@/components/List'
import PlaceOrder from '@/components/placeOrder'
import Cart from '@/components/Cart'
import NotFound from '@/components/NotFound'
Vue.use(Router)

const MAINPATH = '/micro'

const router = new Router({
  routes: [
    {
      path: MAINPATH,
      name: 'Index',
      component: Index
    },
    {
      path: MAINPATH + '/market',
      name: 'devices',
      component: Devices
    },
    {
      path: MAINPATH + '/market/:id',
      name: 'List',
      component: List
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/detail',
      name: 'detail',
      component: Detail
    },
    {
      path: '/order',
      name: 'order',
      component: Order
    },
    {
      path: MAINPATH + '/orderformOnline',
      name: 'placeOrder',
      component: PlaceOrder
    },
    {
      path: MAINPATH + '/cart',
      name: 'cart',
      component: Cart
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFound
    }
  ],
  mode: 'history'
})

export default router
