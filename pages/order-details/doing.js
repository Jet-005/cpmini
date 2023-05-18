const wxbarcode = require('wxbarcode')
const AUTH = require('../../utils/auth')
const APP = getApp()
APP.configLoadOK = () => {

}
Page({
  data: {
    apiOk: false,
    isLogined: true
  },
  onLoad: function (options) {

  },
  onShow: function () {
    AUTH.checkHasLogined().then(isLogined => {
      this.setData({
        isLogined
      })
      if (isLogined) {
        this.orderList();
      }
    })
  },
  toIndexPage: function () {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },
  async orderList() {
    wx.showLoading({
      title: '',
    })

    wx.hideLoading()

  },
  bindchange(e) {
    const index = e.detail.current
    const hxNumber = this.data.orderList[index].hxNumber
    if (!hxNumber) {
      return
    }
    wxbarcode.qrcode('qrcode_' + index, hxNumber, 400, 400);
  },
})