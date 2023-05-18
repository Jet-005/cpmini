const wxpay = require('../../utils/pay.js')
const AUTH = require('../../utils/auth')
const APP = getApp()
APP.configLoadOK = () => {

}
Page({
  data: {
    apiOk: false
  },
  cancelOrderTap: function (e) {
    const that = this;
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {

        }
      }
    })
  },
  toPayTap: function (e) {
    // 防止连续点击--开始
    if (this.data.payButtonClicked) {
      wx.showToast({
        title: '休息一下~',
        icon: 'none'
      })
      return
    }
    this.data.payButtonClicked = true
    setTimeout(() => {
      this.data.payButtonClicked = false
    }, 3000) // 可自行修改时间间隔（目前是3秒内只能点击一次支付按钮）
    // 防止连续点击--结束
    const that = this;
    const orderId = e.currentTarget.dataset.id;
    let money = e.currentTarget.dataset.money;
    const needScore = e.currentTarget.dataset.score;

  },
  _toPayTap: function (orderId, money) {
    const _this = this
    if (money <= 0) {
      // 直接使用余额支付

    } else {
      wxpay.wxpay('order', money, orderId, "/pages/all-orders/index");
    }
  },
  onLoad: function (options) {

  },
  onShow: function () {
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.doneShow();
      } else {
        wx.showModal({
          content: '登陆后才能访问',
          showCancel: false,
          success: () => {
            wx.navigateBack()
          }
        })
      }
    })
  },
  async doneShow() {
    wx.showLoading({
      title: '',
    })

  },
  toIndexPage: function () {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },
  // 删除订单
  deleteOrder: function (e) {
    const that = this
    const id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '提示',
      content: '确定要删除该订单吗？',
      success: function (res) {
        if (res.confirm) {

        } else {
          console.log('用户点击取消')
        }
      }
    })
  },
  async callShop(e) {
    const shopId = e.currentTarget.dataset.shopid

  },
})