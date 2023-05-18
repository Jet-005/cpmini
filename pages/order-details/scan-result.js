const APP = getApp()
APP.configLoadOK = () => {

}

Page({
  data: {

  },
  onLoad: function (e) {
    // e.hxNumber = '2008010532287842'
    this.setData({
      hxNumber: e.hxNumber
    });
  },
  onShow: function () {
    var that = this;

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

  },
  async doneHx() {
    wx.showLoading({
      title: '处理中...',
    })
    // https://www.yuque.com/apifm/nu0f75/sq4sma

    wx.hideLoading()

  },
})