const APP = getApp()

// fixed首次打开不显示标题的bug
APP.configLoadOK = () => {

}
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad: function (options) {
    this.payLogs()
  },
  onShow: function () {

  },
  async payLogs() {
    wx.showLoading({
      title: '',
    })

  },
})