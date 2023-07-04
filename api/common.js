const request = require('../utils/request')

const getDishedsByCategory = (cateId, page) => {
  return request.post(
    '/dished/list', {
      page,
      cateId
    }
  );
}
const getDished = (id) => {
  return request.get(`/dished/get/${id}`)
}
module.exports = {
  getDished,
  getDishedsByCategory
}