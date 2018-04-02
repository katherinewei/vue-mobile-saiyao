import Vue from 'vue'
import {getReplUrl} from '../utils/helper'
import {getAccessToken, setAccessToken, setAccessDeviceId} from './validator'
// js 获取url参数
function getQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

const request = (url, payload, response, id) => {
  const token = getQueryString('token')
  if (token && !(getAccessToken() && getAccessToken() === token)) {
    localStorage.setItem('saveTokenTime', new Date().getTime())
    setAccessToken(token)
  }
  let saveTokenTime = localStorage.getItem('saveTokenTime')

  if (!getAccessToken() || !saveTokenTime || (saveTokenTime && new Date().getTime() - saveTokenTime > 5 * 24 * 60 * 60 * 1000)) {
    let pathname = location.href
    if (getQueryString('deviceId')) {         // 线上
      setAccessDeviceId(getQueryString('deviceId'))
      pathname = pathname + '?deviceId=' + getQueryString('deviceId')
    }
    if (getQueryString('fixed')) {     // 特定机台
      sessionStorage.setItem('specifiedMachine', true)
    }
    if (getQueryString('preview')) {     // 预览
      pathname += '&preview=1'
    }
    setTimeout(() => {
      location.href = 'http://192.168.2.111:5020/v2/bind/micro_shop/?redirect_url=' + encodeURIComponent(pathname)
    }, 100)
    return
  }

  Vue.prototype.$http.defaults.headers.common['Authorization'] = 'JWT ' + getAccessToken()
  Vue.$vux.loading.show({
    text: '正在加载中'
  })

  if (id) {
    url = getReplUrl(url, id)
  }
  const success = (res) => {
    const {data} = res
    Vue.$vux.loading.hide()
    if (data.code) {
      Vue.$vux.toast.show({
        text: data.code + ' : ' + data.message,
        type: 'cancel',
        time: 3000
      })
    } else {
      response(data)
    }
  }
  const error = () => {
    Vue.$vux.toast.show({
      text: '获取失败',
      type: 'cancel'
    })
  }
  return {urlD: url, payloadD: payload, success, error}
}
export const requestGet = (data) => {
  const {url, payload, response, id} = data
  const {urlD, payloadD, success, error} = request(url, payload, response, id)
  Vue.http.get(urlD, {params: payloadD}).then(success, error)
}
export const requestDelete = (data) => {
  const {url, payload, response, id} = data
  const {urlD, success, error} = request(url, payload, response, id)
  Vue.http.delete(urlD).then(success, error)
}
export const requestPost = (data) => {
  const {url, payload, response, id} = data
  const {urlD, payloadD, success, error} = request(url, payload, response, id)
  Vue.http.post(urlD, {...payloadD}).then(success, error)
}
