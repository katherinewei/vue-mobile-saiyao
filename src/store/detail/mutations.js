export default {
    // setCurrentDevice (state, { currentDevice, devices }) {
  //   if (currentDevice) {
  //     state.currentDevice = currentDevice
  //   }
  //   if (devices) {
  //     state.devices = devices
  //   }
  // },
  // setDevicesModal (state, { visible }) {
  //   state.visible = visible
  // },
  getItemResponse (state, {item, activityStatus, startTime, endTime}) {
    state.item = item
    state.activityStatus = activityStatus
    state.startTime = startTime
    state.endTime = endTime
  }
}
