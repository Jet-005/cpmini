const APP = getApp()
APP.configLoadOK = () => {

}

Page({
  data: {
    markers: [],
  },
  onLoad: function (options) {
    // options.id = 36
    this.data.id = options.id
    this.shopSubdetail()
  },
  async shopSubdetail() {

  },
  // 
  phoneCall: function () {
    var phoneNumber = this.data.shopInfo.linkPhone
    wx.makePhoneCall({
      phoneNumber,
      // phoneNumber: phoneNumber,
    })
  },
  // 
  guideNow: function () {
    var name = this.data.shopInfo.name
    var address = this.data.shopInfo.address
    var latitude = this.data.shopInfo.latitude
    var longitude = this.data.shopInfo.longitude
    wx.openLocation({
      name: name,
      address: address,
      latitude: latitude,
      longitude: longitude,
    })
  },
})