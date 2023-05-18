const APP = getApp()

Page({
  data: {
    role: 0, // 0-未配对,1-xx,2-xx
    page: 1,
    peisongType: 'zq', // zq 自取，kd 配送
    showCartPop: false, // 是否显示购物车列表
    showGoodsDetailPOP: false, // 是否显示商品详情
    showCouponPop: false, // 是否弹出优惠券领取提示
    shopIsOpened: false, // 是否营业
    showPingtuanPop: false,
    share_goods_id: undefined,
    share_pingtuan_open_id: undefined,
    lijipingtuanbuy: false,
    pingtuan_open_id: undefined,
    mainActiveIndex: 0,
    activeId: [],
    categories: [{
      // 导航名称
      text: "浙江",
      id: 1
    }, {
      // 导航名称
      text: "江苏",
      id: 2
    }],
    goods: [{
        // 名称
        text: '温州',
        // id，作为匹配选中状态的标识
        id: 1,
        pic: 'https://img.yzcdn.cn/vant/apple-1.jpg',
        price: 10
      },
      {
        text: '杭州',
        id: 2,
        pic: 'https://img.yzcdn.cn/vant/apple-1.jpg',
        price: 10

      }
    ]
  },
  onLoad: function (e) {

  },
  onShow: function () {

  },
  onChange(event) {

  }
})