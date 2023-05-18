const APP = getApp()

// fixed首次打开不显示标题的bug
APP.configLoadOK = () => {

}

Page({
  data: {

  },
  onLoad: function (options) {

  },
  onShow: function () {
    this.shippingCarInfo()
  },
  onPullDownRefresh() {
    this.shippingCarInfo()
    wx.stopPullDownRefresh()
  },
  async shippingCarInfo() {
    wx.showLoading({
      title: '',
    })
    wx.hideLoading({
      success: (res) => {},
    })

  },
  async cartStepChange(e) {
    const token = wx.getStorageSync('token')
    const index = e.currentTarget.dataset.idx
    const item = this.data.shippingCarInfo.items[index]
    if (e.detail < item.minBuyNumber) {
      // 删除商品
      wx.showLoading({
        title: '',
      })
      wx.hideLoading()

      this.shippingCarInfo()
    } else {
      // 修改数量
      wx.showLoading({
        title: '',
      })
      wx.hideLoading()

      this.shippingCarInfo()
    }
  },
  async clearCart() {
    wx.showLoading({
      title: '',
    })
    wx.hideLoading()

    this.shippingCarInfo()
  },
  async goCreateOrder() {
    const goodsJsonStr = []
    this.data.shippingCarInfo.items.forEach(ele => {
      let propertyChildIds = ''
      if (ele.sku) {
        ele.sku.forEach(_sku => {
          propertyChildIds += `,${_sku.optionId}:${_sku.optionValueId}`
        })
      }
      goodsJsonStr.push({
        goodsId: ele.goodsId,
        number: ele.number,
        propertyChildIds,
      })
    })
    wx.showLoading({
      title: '',
    })

    wx.hideLoading()

    await this.clearCart()
    wx.redirectTo({
      url: '/pages/cart/order',
    })
  },
})