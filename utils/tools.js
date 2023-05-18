// 显示购物车tabBar的Badge
async function showTabBarBadge(noTabBarPage) {
  const token = wx.getStorageSync('token')
  if (!token) {
    return 0
  }
  let number = 0
  // 自营商品

  return number
}

module.exports = {
  showTabBarBadge: showTabBarBadge
}