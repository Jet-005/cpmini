const request = require('../utils/request')
// 获取分类
const getCategories = (page = 1, params = {}) => {
  return request.get(
    `/category/list/${page}`,
    params
  );
}
// 保存分类
const saveCategories = (data = {}) => {
  return request.post(
    '/category/save',
    data
  );
}
// 编辑分类
const editCategories = (data = {}) => {
  return request.post(
    '/category/edit',
    data
  );
}
const getCategoryInfo = (id) => {
  return request.get(
    '/category/getInfo', {
      id
    }
  );
}
module.exports = {
  getCategories: getCategories,
  saveCategories: saveCategories,
  getCategoryInfo: getCategoryInfo,
  editCategories: editCategories
}