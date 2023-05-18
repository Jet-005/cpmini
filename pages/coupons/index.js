const APP = getApp()
const AUTH = require('../../utils/auth')

// fixed首次打开不显示标题的bug
APP.configLoadOK = () => {

}
Page({
  data: {
    tabIndex: 0
  },
  onLoad: function (options) {
    if (options.tabIndex) {
      this.setData({
        tabIndex: options.tabIndex * 1
      })
    }
    this.fetchData()
  },
  tabChange(event) {
    this.setData({
      tabIndex: event.detail.name
    })
    this.fetchData()
  },
  fetchData() {
    if (this.data.tabIndex == 0) {
      this.coupons()
    } else {
      this.mycoupons()
    }
  },
  onShow: function () {

  },
  async coupons() {
    wx.showLoading({
      title: '',
    })

    wx.hideLoading()

  },
  async fetchCounpon(e) {
    const idx = e.currentTarget.dataset.idx
    const coupon = this.data.coupons[idx]

  },
  async mycoupons() {
    wx.showLoading({
      title: '',
    })
    let status = '0'
    if (this.data.tabIndex == 2) {
      status = '1,2,3'
    }
    wx.hideLoading()

  },
})