const request = require('../utils/request')
// 获取订单列表
const getUserOrderList = (data = {}) => {
  return request.get(
    `/order/user/list`, data
  );
}
// 创建订单
const createOrder = (data = {}) => {
  return request.post(
    '/order/create',
    data
  );
}
module.exports = {
  getUserOrderList,
  createOrder
}