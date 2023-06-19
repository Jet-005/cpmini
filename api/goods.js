const request = require('../utils/request')

// 获取商品
const getGoods = (page = 1, params = {}) => {
  return request({
    url: `/goods/list/${page}`,
    method: 'get',
    params
  });
}
module.exports = {
  getGoods: getGoods
}