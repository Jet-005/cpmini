const AUTH = require('../../utils/auth')
const APP = getApp()
APP.configLoadOK = () => {
  
}

Page({
  data: {
    totleConsumed: 0
  },
  onLoad: function (options) {
    this.userLevelList()
    this.userAmount()
    this.getUserApiInfo()
  },
  onShow: function () {
    AUTH.checkHasLogined().then(isLogined => {
      if (!isLogined) {
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
  async userAmount() {
   
  },
  async getUserApiInfo() {
    
  },
  async userLevelList() {
   
  },
})