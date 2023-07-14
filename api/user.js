const request = require('../utils/request')

const getCategories = (page = 1, params = {}) => {
  return request.get(
    `/category/user/list/${page}`,
    params
  );
}
const getUserDishedsByCate = (cateId, page) => {
  return request.post(
    '/dished/user/list', {
      page,
      cateId
    }
  );
}
const likeDisheds = (dishedId, isLike) => {
  return request.get(
    `/dished/user/like/${dishedId}/${isLike}`
  );
}
module.exports = {
  getCategories,
  getUserDishedsByCate,
  likeDisheds
}