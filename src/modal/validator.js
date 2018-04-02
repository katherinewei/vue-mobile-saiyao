import jwtDecode from 'jwt-decode'
const ACCESS_TOKEN_KEY = 'access_token'
const ACCESS_DEVICE_ID = 'access_deviceId'
const ACCESS_OPERATOR_ID = 'access_operatorId'
const ACCESS_OPENID = 'access_openid'
const ACCESS_SN_KEY = 'access_sn'
const ACCESS_CNO = 'access_cno'

export function getAccessToken () {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)
  return token
}

export function setAccessToken (token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function getAccessDeviceId () {
  const DeviceId = localStorage.getItem(ACCESS_DEVICE_ID)
  return DeviceId
}

export function setAccessDeviceId (DeviceId) {
  localStorage.setItem(ACCESS_DEVICE_ID, DeviceId)
}

export function getAccessOperatorId () {
  const OperatorId = localStorage.getItem(ACCESS_OPERATOR_ID)
  return OperatorId
}

export function setAccessOperatorId (OperatorId) {
  localStorage.setItem(ACCESS_OPERATOR_ID, OperatorId)
}

export function getAccessOpendId () {
  const openid = localStorage.getItem(ACCESS_OPENID)
  return openid
}

export function setAccessOpendId (openid) {
  localStorage.setItem(ACCESS_OPENID, openid)
}

export function getAccessSN () {
  const sn = localStorage.getItem(ACCESS_SN_KEY)
  return sn
}

export function setAccessSN (sn) {
  localStorage.setItem(ACCESS_SN_KEY, sn)
}
export function getAccessCNO () {
  const sn = localStorage.getItem(ACCESS_CNO)
  return sn
}

export function setAccessCNO (CNO) {
  localStorage.setItem(ACCESS_CNO, CNO)
}

function getRole () {
  const decoded = jwtDecode(getAccessToken())
  return decoded
}

export function UserId () {
  return getRole().oid
}
