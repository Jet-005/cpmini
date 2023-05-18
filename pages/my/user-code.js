import wxbarcode from 'wxbarcode'

Page({
  data: {
    balance: 0,
    freeze: 0,
    score: 0,
    growth: 0,
    userCode: undefined
  },
  onLoad(e) {
    this.getUserAmount()
    this.dynamicUserCode()
  },
  onShow: function () {
  },
  onPullDownRefresh() {
    this.getUserAmount()
    this.dynamicUserCode()
    wx.stopPullDownRefresh()
  },
  async getUserAmount() {
   
  },
  async dynamicUserCode() {
    
  },
})