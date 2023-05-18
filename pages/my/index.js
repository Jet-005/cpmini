const CONFIG = require('../../config.js')
const AUTH = require('../../utils/auth')
const APP = getApp()
const API = require('../../api/login.js')

APP.configLoadOK = () => {

}

Page({
  data: {
    userInfo: {
      nickName: "",
      avatarUrl: "",
      gender: ""
    },

    couponStatistics: {
      canUse: 0
    },
    balance: 0.00,
    score: 0,
    nick: undefined,
  },
  onLoad() {
    const order_hx_uids = wx.getStorageSync('order_hx_uids')
    this.setData({
      myBg: wx.getStorageSync('myBg'),
      version: CONFIG.version,
      order_hx_uids
    })
  },
  onShow() {
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        AUTH.login()
      } else {
        AUTH.authorize().then(res => {
          AUTH.bindSeller()
        })
      }
    })
  },
  async loginClick() {
    const info = await wx.getUserProfile({
      desc: "展示个人信息"
    })
    // 用户信息非必填数据
    const userInfo = info.errMsg === "getUserProfile:ok" ? info.userInfo : {}
    wx.login({
      success: async (res) => {
        if (res && res.code) {
          const sendData = Object.assign({}, userInfo)
          sendData.code = res.code
          const result = await API.login(sendData)
          console.log(result)
          this.setData({})
        }
      },
    })
  },
  async getUserApiInfo() {

  },
  async couponStatistics() {

  },
  async getUserAmount() {

  },
  scanOrderCode() {
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        wx.navigateTo({
          url: '/pages/order-details/scan-result?hxNumber=' + res.result,
        })
      },
      fail(err) {
        console.error(err)
        wx.showToast({
          title: err.errMsg,
          icon: 'none'
        })
      }
    })
  },
  goCoupons() {
    wx.navigateTo({
      url: '/pages/coupons/index?tabIndex=1',
    })
  },
  goBalance() {
    wx.navigateTo({
      url: '/pages/asset/index',
    })
  },
  goScorelog() {
    wx.navigateTo({
      url: '/pages/score/logs',
    })
  },
  goadmin() {
    wx.navigateToMiniProgram({
      appId: 'wx5e5b0066c8d3f33d',
      path: 'pages/login/auto?token=' + wx.getStorageSync('token'),
    })
  },
  clearStorage() {
    wx.clearStorageSync()
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  govip() {
    wx.navigateTo({
      url: '/pages/member-center/index',
    })
  },
  editNick() {
    this.setData({
      nickShow: true
    })
  },
  async _editNick() {
    if (!this.data.nick) {
      wx.showToast({
        title: '请填写昵称',
        icon: 'none'
      })
      return
    }
    const postData = {
      token: wx.getStorageSync('token'),
      nick: this.data.nick,
    }

    wx.showToast({
      title: '设置成功',
    })
    this.getUserApiInfo()
  },
  async onChooseAvatar(e) {
    console.log(e);
    const avatarUrl = e.detail.avatarUrl

    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    wx.showToast({
      title: '设置成功',
    })
    this.getUserApiInfo()
  },
  goUserCode() {
    wx.navigateTo({
      url: '/pages/my/user-code',
    })
  },
})