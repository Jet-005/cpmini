const request = require('../utils/request')

const getCategories = (page = 1, params = {}) => {
  return request.get(
    `/category/user/list/${page}`,
    params
  );
}

module.exports = {
  getCategories
}