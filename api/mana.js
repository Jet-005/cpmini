const request = require('../utils/request')
// 获取分类
const getCategories = (page = 1, params = {}) => {
  return request.get(
    `/category/mana/list/${page}`,
    params
  );
}
// 保存分类
const saveCategories = (data = {}) => {
  return request.post(
    '/category/mana/save',
    data
  );
}
// 编辑分类
const editCategories = (data = {}) => {
  return request.post(
    '/category/mana/update',
    data
  );
}
const getCategoryInfo = (id) => {
  return request.get(
    `/category/mana/get/${id}`
  );
}
const editDished = (data) => {
  return request.post('/dished/mana/update', data)
}
const addDished = (data) => {
  return request.post('/dished/mana/save', data)
}

const changeDishedStatus = (id, isOnline) => {
  return request.get(`/dished/mana/change/${id}/${isOnline}`)

}
module.exports = {
  getCategories: getCategories,
  saveCategories: saveCategories,
  getCategoryInfo: getCategoryInfo,
  editCategories: editCategories,
  editDished,
  addDished,
  changeDishedStatus
}