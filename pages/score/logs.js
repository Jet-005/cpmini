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
    this.scoreLogs()
  },
  onShow: function () {

  },
  async scoreLogs() {
    wx.showLoading({
      title: '',
    })

    wx.hideLoading()

  },
})