const APP = getApp()

Page({
  data: {
    show: true,
    curRole: 'mana',
    tabbar: {
      mana: [{
        icon: "cluster-o",
        name: "分类管理",
        path: "/pages/index/index",
        key: "category",
      }, {
        icon: "orders-o",
        name: "订单管理",
        path: "/pages/orderMana/index",
        key: "orderMana",
      }, {
        icon: "user-o",
        name: "个人中心",
        key: "member",
        path: "/pages/my/index"
      }],
      user: [{
        icon: "",
        name: ""
      }, {
        icon: "user-o",
        name: "个人中心",
        key: "member",
        path: "/pages/my/index"
      }]
    },
    active: ""
  },
  onLoad: function (e) {
    const {
      tabbar,
      curRole
    } = this.data
    const curTabbar = tabbar[curRole][0].key
    this.setData({
      active: curTabbar
    })
  },
  onShow: function () {

  },
  onChange(event) {
    const {
      detail
    } = event
    console.log(detail)
    const {
      tabbar,
      curRole
    } = this.data
    const curTabItem = tabbar[curRole].find((e) => e.key === detail)
    this.setData({
      active: detail
    })
    console.log(curTabItem)
    wx.switchTab({
      url: curTabItem.path,
    })


  }
})