const APP = getApp()

// fixed首次打开不显示标题的bug
APP.configLoadOK = () => {

}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0.00,
    ruleSelIndex: 0,
    showRechargePop: false
  },
  onLoad: function (options) {
    this.rechargeRule()
  },
  onShow: function () {
    this.getUserAmount()
  },
  async getUserAmount() {

  },
  async rechargeRule() {

  },
  changePersionNum(e) {
    if (e.currentTarget.dataset.idx == -1) {
      this.data.showRechargePop = true
    }
    this.setData({
      ruleSelIndex: e.currentTarget.dataset.idx,
      showRechargePop: this.data.showRechargePop,
      amount2: null
    })
  },
  submit1() {
    if (this.data.ruleSelIndex == -1) {
      this.setData({
        showRechargePop: true,
        amount2: null
      })
      return
    }
    const amount = this.data.rechargeSendRules[this.data.ruleSelIndex].confine
    this.wxpay(amount);
  },
  onClose() {
    this.setData({
      showRechargePop: false
    })
  },
  submit2() {
    if (!this.data.amount2) {
      wx.showToast({
        title: '请输入充值金额',
        icon: 'none'
      })
      return
    }
    this.wxpay(this.data.amount2);
  },
  wxpay(money) {
    const _this = this
    const postData = {
      token: wx.getStorageSync('token'),
      money: money,
      payName: "在线充值",
      remark: "在线充值",
    }

  }
})