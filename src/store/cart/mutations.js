export default {
  setCartCurrentValue (state, { currentItem, cartNum, xNum, type }) {
    if (currentItem) {
      state.currentItem = currentItem
    }
    if (cartNum) {
      state.cartNum = cartNum
    }
    if (xNum) {
      state.xNum = xNum
    }
    if (type) {
      state.type = type
    }
  },
  setCartModal (state, { isShowAddCart }) {
    state.isShowAddCart = isShowAddCart
  },
  setCartNumber (state, {cartNumber}) {
    state.cartNumber = cartNumber
  }
}
