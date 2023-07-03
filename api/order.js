const request = require('../utils/request')
// 获取订单列表
const getOrderList = (page = 1, data = {}) => {
  return request.post(
    `/order/list/${page}`,
    data
  );
}

module.exports = {
  getOrderList
}