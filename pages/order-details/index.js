const APP = getApp();
APP.configLoadOK = () => {
  wx.setNavigationBarTitle({
    title: wx.getStorageSync('mallName')
  })
}
const wxbarcode = require('wxbarcode')
const wxpay = require('../../utils/pay.js')

Page({
  data: {

  },
  onLoad: function (e) {
    // e.id = 601144
    this.setData({
      orderId: e.id
    })
    this.orderDetail()
  },
  onShow: function () {

  },
  async orderDetail() {

  },
  async shopSubdetail() {

  },
  async toPayTap() {
    // 立即支付

  },
  callshop() {
    wx.makePhoneCall({
      phoneNumber: this.data.shopSubdetail.info.linkPhone,
    })
  },
  wuliuDetailsTap: function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/wuliu/index?id=" + orderId
    })
  },
  confirmBtnTap: function (e) {
    let that = this;
    let orderId = this.data.orderId;
    wx.showModal({
      title: '确认您已收到商品？',
      content: '',
      success: function (res) {
        if (res.confirm) {

        }
      }
    })
  },
  submitReputation: function (e) {
    let that = this;
    let postJsonString = {};
    postJsonString.token = wx.getStorageSync('token');
    postJsonString.orderId = this.data.orderId;
    let reputations = [];
    let i = 0;
    while (e.detail.value["orderGoodsId" + i]) {
      let orderGoodsId = e.detail.value["orderGoodsId" + i];
      let goodReputation = e.detail.value["goodReputation" + i];
      let goodReputationRemark = e.detail.value["goodReputationRemark" + i];

      let reputations_json = {};
      reputations_json.id = orderGoodsId;
      reputations_json.reputation = goodReputation;
      reputations_json.remark = goodReputationRemark;

      reputations.push(reputations_json);
      i++;
    }
    postJsonString.reputations = reputations;

  }
})