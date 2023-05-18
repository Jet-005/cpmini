const AUTH = require('../../utils/auth')
const wxpay = require('../../utils/pay.js')
const CONFIG = require('../../config.js')
const APP = getApp()
APP.configLoadOK = () => {

}

Page({
  data: {
    wxlogin: true,
    switch1: true, //switch开关

    addressList: [],
    curAddressData: [],

    totalScoreToPay: 0,
    goodsList: [],
    allGoodsPrice: 0,
    amountReal: 0,
    yunPrice: 0,
    allGoodsAndYunPrice: 0,
    goodsJsonStr: "",
    orderType: "", //订单类型，购物车下单或立即支付下单，默认是购物车，
    pingtuanOpenId: undefined, //拼团的话记录团号

    curCoupon: null, // 当前选择使用的优惠券
    curCouponShowText: '请选择使用优惠券', // 当前选择使用的优惠券
    peisongType: '', // 配送方式 kd,zq 分别表示快递/到店自取【默认值到onshow修改，这里修改无效】
    submitLoding: false,
    remark: '',

    currentDate: new Date().getHours() + ':' + (new Date().getMinutes() % 10 === 0 ? new Date().getMinutes() : Math.ceil(new Date().getMinutes() / 10) * 10),
    minHour: new Date().getHours(),
    minMinute: new Date().getMinutes(),
    formatter(type, value) {
      if (type === 'hour') {
        return `${value}点`;
      } else if (type === 'minute') {
        return `${value}分`;
      }
      return value;
    },
    filter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 10 === 0);
      }
      return options;
    },
    packaging_fee_use: '1', // 自提需要包装费
  },
  diningTimeChange(a) {
    const selectedHour = a.detail.getColumnValue(0).replace('点', '') * 1
    if (selectedHour == new Date().getHours()) {
      let minMinute = new Date().getMinutes()
      if (minMinute % 10 !== 0) {
        minMinute = minMinute / 10 + 1
      }
      this.setData({
        minMinute
      })
    } else {
      this.setData({
        minMinute: 0
      })
    }
  },
  onShow() {
    const shopInfo = wx.getStorageSync('shopInfo')
    let peisongType = wx.getStorageSync('peisongType')
    if (!peisongType) {
      peisongType = 'zq' // 此处修改默认值
    }
    if (shopInfo.openWaimai && !shopInfo.openZiqu) {
      peisongType = 'kd'
    }
    if (!shopInfo.openWaimai && shopInfo.openZiqu) {
      peisongType = 'zq'
    }
    this.setData({
      shopInfo,
      peisongType
    })
    AUTH.checkHasLogined().then(isLogined => {
      this.setData({
        wxlogin: isLogined
      })
      if (isLogined) {
        this.doneShow()
      }
    })
    AUTH.wxaCode().then(code => {
      this.data.code = code
    })
  },
  async doneShow() {
    let goodsList = [];
    const token = wx.getStorageSync('token')
    //立即购买下单
    if ("buyNow" == this.data.orderType) {
      goodsList = wx.getStorageSync('pingtuanGoodsList')
    } else {
      //购物车下单

    }
    this.setData({
      goodsList: goodsList
    })
    this.initShippingAddress()
  },

  onLoad(e) {
    let _data = {
      kjId: e.kjId,
      create_order_select_time: wx.getStorageSync('create_order_select_time'),
      packaging_fee: wx.getStorageSync('packaging_fee'),
    }
    if (e.orderType) {
      _data.orderType = e.orderType
    }
    if (e.pingtuanOpenId) {
      _data.pingtuanOpenId = e.pingtuanOpenId
    }
    this.setData(_data)
    this.getUserApiInfo()
    this._peisonFeeList()
  },
  selected(e) {
    const peisongType = e.currentTarget.dataset.pstype
    this.setData({
      peisongType
    })
    wx.setStorageSync('peisongType', peisongType)
    this.createOrder()
  },

  getDistrictId: function (obj, aaa) {
    if (!obj) {
      return "";
    }
    if (!aaa) {
      return "";
    }
    return aaa;
  },
  // 备注
  remarkChange(e) {
    this.data.remark = e.detail.value
  },
  goCreateOrder() {
    if (this.data.submitLoding) return
    const mobile = this.data.mobile
    if (this.data.peisongType == 'zq' && !mobile) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
      return
    }
    if (!this.data.diningTime && this.data.create_order_select_time == '1') {
      wx.showToast({
        title: '请选择自取/配送时间',
        icon: 'none'
      })
      return
    }
    this.setData({
      submitLoding: true
    })
    const subscribe_ids = wx.getStorageSync('subscribe_ids')
    if (subscribe_ids) {
      wx.requestSubscribeMessage({
        tmplIds: subscribe_ids.split(','),
        success(res) {},
        fail(e) {
          this.setData({
            submitLoding: false
          })
          console.error(e)
        },
        complete: (e) => {
          this.createOrder(true)
        },
      })
    } else {
      if (this.data.shopInfo.serviceDistance && this.data.distance && this.data.distance > this.data.shopInfo.serviceDistance * 1 && this.data.peisongType == 'kd') {
        wx.showToast({
          title: '当前地址超出配送范围',
          icon: 'none'
        })
        return
      }
      this.createOrder(true)
    }
  },
  async createOrder(e) {
    var that = this;
    var loginToken = wx.getStorageSync('token') // 用户登录 token
    var remark = this.data.remark; // 备注信息
    const postData = {
      token: loginToken,
      goodsJsonStr: that.data.goodsJsonStr,
      remark: remark,
      peisongType: that.data.peisongType,
      isCanHx: true
    }
    if (this.data.shopInfo) {
      if (!this.data.shopInfo.openWaimai && !this.data.shopInfo.openZiqu) {
        wx.showModal({
          title: '错误',
          content: '堂食和外卖服务已关闭',
          showCancel: false
        })
        return;
      }
      postData.shopIdZt = this.data.shopInfo.id
      postData.shopNameZt = this.data.shopInfo.name
    }
    if (that.data.kjId) {
      postData.kjid = that.data.kjId
    }
    if (that.data.pingtuanOpenId) {
      postData.pingtuanOpenId = that.data.pingtuanOpenId
    }
    const extJsonStr = {}
    if (postData.peisongType == 'zq') {
      extJsonStr['联系电话'] = this.data.mobile
      if (this.data.packaging_fee && this.data.packaging_fee_use == '1') {
        postData.trips = this.data.packaging_fee
      }
    }
    if (this.data.create_order_select_time == '1') {
      if (postData.peisongType == 'zq') {
        extJsonStr['取餐时间'] = this.data.diningTime
      } else {
        extJsonStr['送达时间'] = this.data.diningTime
      }
    }
    postData.extJsonStr = JSON.stringify(extJsonStr)
    // 有设置了配送费的情况下，计算运费
    if (this.data.peisonFeeList && postData.peisongType == 'kd') {
      let distance = await this.getDistance(this.data.curAddressData)
      const peisonFee = this.data.peisonFeeList.find(ele => {
        return ele.distance >= distance
      })
      if (peisonFee) {
        postData.peisongFeeId = peisonFee.id
      }
    }
    if (e && postData.peisongType == 'kd') {
      if (!that.data.curAddressData) {
        wx.hideLoading();
        wx.showToast({
          title: '请设置收货地址',
          icon: 'none'
        })
        return;
      }
      // 达达配送
      if (this.data.shopInfo.number && this.data.shopInfo.expressType == 'dada') {
        postData.dadaShopNo = this.data.shopInfo.number
        postData.lat = this.data.curAddressData.latitude
        postData.lng = this.data.curAddressData.longitude
      }
      if (postData.peisongType == 'kd') {
        postData.provinceId = that.data.curAddressData.provinceId;
        postData.cityId = that.data.curAddressData.cityId;
        if (that.data.curAddressData.districtId) {
          postData.districtId = that.data.curAddressData.districtId;
        }
        postData.address = that.data.curAddressData.address;
        postData.linkMan = that.data.curAddressData.linkMan;
        postData.mobile = that.data.curAddressData.mobile;
        postData.code = that.data.curAddressData.code;
      }
    }
    if (that.data.curCoupon) {
      postData.couponId = that.data.curCoupon.id;
    }
    if (!e) {
      postData.calculate = "true";
    }
    // console.log(postData)
    // console.log(e)

  },
  async processAfterCreateOrder(res) {
    // 直接弹出支付，取消支付的话，去订单列表

  },
  async getDistance(curAddressData) {
    // 计算门店与收货地址之间的距离
    if (!this.data.shopInfo || !this.data.shopInfo.latitude || !this.data.shopInfo.longitude || !curAddressData || !curAddressData.latitude || !curAddressData.longitude) {
      return 0
    }
    let distance = 0
    const QQ_MAP_KEY = wx.getStorageSync('QQ_MAP_KEY')
    if (QQ_MAP_KEY == '1') {

    }
    // 只能计算直线距离
    return this.getDistanceLine(this.data.shopInfo.latitude, this.data.shopInfo.longitude, curAddressData.latitude, curAddressData.longitude) / 1000
  },
  getDistanceLine(lat1, lng1, lat2, lng2) {
    var dis = 0;
    var radLat1 = toRadians(lat1);
    var radLat2 = toRadians(lat2);
    var deltaLat = radLat1 - radLat2;
    var deltaLng = toRadians(lng1) - toRadians(lng2);
    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
    return dis * 6378137;

    function toRadians(d) {
      return d * Math.PI / 180;
    }
  },
  async initShippingAddress() {

    this.processYunfei();
  },
  processYunfei() {
    var goodsList = this.data.goodsList
    if (goodsList.length == 0) {
      return
    }
    const goodsJsonStr = []
    var isNeedLogistics = 0;

    let inviter_id = 0;
    let inviter_id_storge = wx.getStorageSync('referrer');
    if (inviter_id_storge) {
      inviter_id = inviter_id_storge;
    }
    for (let i = 0; i < goodsList.length; i++) {
      let carShopBean = goodsList[i];
      if (carShopBean.stores < carShopBean.minBuyNumber) {
        continue
      }
      if (carShopBean.logistics || carShopBean.logisticsId) {
        isNeedLogistics = 1;
      }

      const _goodsJsonStr = {
        propertyChildIds: carShopBean.propertyChildIds
      }
      if (carShopBean.sku && carShopBean.sku.length > 0) {
        let propertyChildIds = ''
        carShopBean.sku.forEach(option => {
          propertyChildIds = propertyChildIds + ',' + option.optionId + ':' + option.optionValueId
        })
        _goodsJsonStr.propertyChildIds = propertyChildIds
      }
      if (carShopBean.additions && carShopBean.additions.length > 0) {
        let goodsAdditionList = []
        carShopBean.additions.forEach(option => {
          goodsAdditionList.push({
            pid: option.pid,
            id: option.id
          })
        })
        _goodsJsonStr.goodsAdditionList = goodsAdditionList
      }
      _goodsJsonStr.goodsId = carShopBean.goodsId
      _goodsJsonStr.number = carShopBean.number
      _goodsJsonStr.logisticsType = 0
      _goodsJsonStr.inviter_id = inviter_id
      goodsJsonStr.push(_goodsJsonStr)
    }
    this.setData({
      isNeedLogistics: isNeedLogistics,
      goodsJsonStr: JSON.stringify(goodsJsonStr)
    });
    this.createOrder()
  },
  addAddress: function () {
    wx.navigateTo({
      url: "/pages/ad/index"
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url: "/pages/ad/index"
    })
  },
  bindChangeCoupon: function (e) {
    const selIndex = e.detail.value;
    this.setData({
      curCoupon: this.data.coupons[selIndex],
      curCouponShowText: this.data.coupons[selIndex].nameExt
    })
    this.createOrder()
  },
  async getPhoneNumber(e) {
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showToast({
        title: e.detail.errMsg,
        icon: 'none'
      })
      return;
    }
    AUTH.wxaCode().then(code => {
      this.data.code = code
    })

  },
  async getUserApiInfo() {

  },
  diningTimeShow() {
    this.setData({
      diningTimeShow: true
    })
  },
  diningTimeHide() {
    this.setData({
      diningTimeShow: false
    })
  },
  diningTimeConfirm(e) {
    this.setData({
      diningTime: e.detail
    })
    this.diningTimeHide()
  },
  updateUserInfo(e) {
    wx.getUserProfile({
      lang: 'zh_CN',
      desc: '用于完善会员资料',
      success: res => {
        console.log(res);
        this._updateUserInfo(res.userInfo)
      },
      fail: err => {
        wx.showToast({
          title: err.errMsg,
          icon: 'none'
        })
      }
    })
  },
  async _updateUserInfo(userInfo) {
    const postData = {
      token: wx.getStorageSync('token'),
      nick: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
      city: userInfo.city,
      province: userInfo.province,
      gender: userInfo.gender,
    }

    wx.showToast({
      title: '登陆成功',
    })
    this.getUserApiInfo()
  },
  async _peisonFeeList() {
    // https://www.yuque.com/apifm/nu0f75/nx465k

  },
  packaging_fee_Change(event) {
    this.setData({
      packaging_fee_use: event.detail,
    })
    this.createOrder()
  },
  packaging_fee_Click(event) {
    const {
      name
    } = event.currentTarget.dataset;
    this.setData({
      packaging_fee_use: name,
    })
    this.createOrder()
  },
})