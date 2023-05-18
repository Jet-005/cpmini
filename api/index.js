const request = require('../utils/request')
// 获取分类
const getCategories = (page = 1, params = {}) => {
  return request({
    url: `/active/list/${page}`,
    method: 'get',
    params
  });
}
// 获取商品
const getGoods = (page = 1, params = {}) => {
  return request({
    url: `/active/list/${page}`,
    method: 'get',
    params
  });
}
module.exports = {
  getCategories: getCategories,
  getGoods: getGoods
}