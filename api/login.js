const request = require('../utils/request.js')
// 登录
const login = (data) => {
  return request.post(
    `/login`, data
  );
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
  login: login,
  getGoods: getGoods
}