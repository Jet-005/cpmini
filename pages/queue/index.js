const AUTH = require('../../utils/auth')

Page({
  data: {

  },
  onLoad: function (options) {

  },
  onShow: function () {
    AUTH.checkHasLogined().then(isLogin => {
      if (isLogin) {
        this.queuingTypes()
        this.queuingMy()
        AUTH.bindSeller()
      } else {
        AUTH.authorize().then(res => {
          this.queuingTypes()
          this.queuingMy()
          AUTH.bindSeller()
        })
      }
    })

  },
  async queuingTypes() {
    wx.showLoading({
      title: '',
    })
    wx.hideLoading({
      success: (res) => {},
    })

  },
  async queuingMy() {

  },
  async queuingGet(e) {
    const index = e.currentTarget.dataset.index
    const queueType = this.data.list[index]
    const isLogined = await AUTH.checkHasLogined()
    if (!isLogined) {
      AUTH.login(this)
      return
    }
    wx.showLoading({
      title: '',
    })
    wx.hideLoading({
      success: (res) => {},
    })

  },
})