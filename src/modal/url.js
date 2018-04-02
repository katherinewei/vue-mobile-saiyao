const apiCard = 'bind/wx/'
const URL = {
  wxsdk: apiCard + 'jsdk_config',
  card_balance: apiCard + 'card_balance',
  card_recharge: apiCard + 'card_recharge',
  card_recharge_settings: apiCard + 'card_recharge_settings',
  card_record: apiCard + 'card_record',
  card_cost_order: apiCard + 'card_cost_order',
  card_activate: apiCard + 'card_activate',
  devices: 'devices/',
  device: 'devices/{0}',
  uploadImage: 'images/token/',
  categories: 'categories/',
  devices_items: 'devices/{0}/items/',
  orders: 'orders/',
  ordersPay: 'pay/',
  order: 'orders/{0}',
  store_orders: 'store/orders',
  store_product: 'store/product/{0}',
  store_marketing: 'store/marketing/{0}',
  store_group_buy: 'store/group_buy',
  store_page: 'store/page',
  store_hot: 'store/hot',
  store_products: 'store/product/',
  store_marketings: 'store/marketing',
  store_pre: 'store/pre',
  users: 'users/{0}'
}
export default URL
