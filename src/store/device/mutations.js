export default {
  // playVideo (state, { audio }) {
  //   state.url = audio.url
  //   state.cover = audio.cover
  //   state.playStatus = true
  // },
  setCurrentDevice (state, { currentDevice, devices }) {
    if (currentDevice) {
      state.currentDevice = currentDevice
    }
    if (devices) {
      state.devices = devices
    }
  },
  setDevicesModal (state, { visible }) {
    state.visible = visible
  },
  getItemsResponse (state, { items }) {
    state.items = items
  }
}
