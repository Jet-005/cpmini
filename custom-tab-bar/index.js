const APP = getApp()
const utils = require('../utils/util')
Page({
  data: {
    show: true,
    curRole: utils.getRole(),
    tabbar: {
      mana: [{
          icon: "cluster-o",
          name: "分类管理",
          path: "/pages/index/index",
          key: "category",
        },
        {
          icon: "orders-o",
          name: "订单管理",
          path: "/pages/orderMana/index",
          key: "orderMana",
        }, {
          icon: "user-o",
          name: "个人中心",
          key: "member",
          path: "/pages/my/index"
        }
      ],
      user: [{
          icon: "bag-o",
          name: "下单",
          key: "disheds",
          path: "/pages/index/index"
        },
        {
          icon: "todo-list-o",
          name: "订单",
          key: "order",
          path: "/pages/orderMana/index"
        }, {
          icon: "user-o",
          name: "个人中心",
          key: "member",
          path: "/pages/my/index"
        }
      ]
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
    const {
      tabbar,
      curRole
    } = this.data
    const curTabItem = tabbar[curRole].find((e) => e.key === detail)
    this.setData({
      active: detail
    })
    wx.switchTab({
      url: curTabItem.path,
    })
  }
})