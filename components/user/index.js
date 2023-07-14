// components/user/index.js
const API = require('../../api/user')
const APICom = require('../../api/common')
const utils = require('../../utils/util')
Component({
  options: {
    styleIsolation: 'shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    created: function () {
      this.getCategories()
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    categories: [],
    disheds: [],
    mainActiveIndex: 0,
    activeId: 0,
    page: 1,
    dishPage: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    categoryNavClick(e) {
      this.setData({
        mainActiveIndex: e.detail.index || 0
      });
      // 获取商品信息
      // this.getGoodsList()
    },
    categoryItemClick(e) {
      const {
        activeId
      } = this.data

    },
    // 获取分类
    async getCategories() {
      const res = await API.getCategories()
      const resData = res.data || []
      resData.forEach((e) => {
        e.text = e.name
        e.id = e._id
      })
      this.setData({
        page: 1,
        categories: res.data,
        mainActiveIndex: 0
      })
      this.getGoodsList()
    },
    async getGoodsList() {
      const {
        mainActiveIndex,
        categories,
        dishPage
      } = this.data
      const curNav = categories[mainActiveIndex]
      const res = await API.getUserDishedsByCate(curNav._id, dishPage)
      this.setData({
        categories,
        disheds: res.data
      })
    },
    handleCatch() {},
    gotoCart() {
      wx.navigateTo({
        url: '../../user/cart/index',
      })
    },
    onClickAdd(e) {
      const {
        item
      } = e.currentTarget.dataset
      const data = wx.getStorageSync('cart') || []
      const info = data.find((e) => e._id === item._id)
      if (info) {
        info.nums++
      } else {
        item.nums = 1
        data.push(item)
      }

      wx.setStorageSync('cart', data)
    },
    async doLike(e) {
      const {
        item
      } = e.currentTarget.dataset
      const res = await API.likeDisheds(item.isLike, item._id)
      if (res.success) {
        this.getGoodsList()
      }
    },
    toDishedDetail(e) {
      const {
        id
      } = e.currentTarget.dataset
      let url = `../../user/dishes/detail/index?id=${id}`
      wx.navigateTo({
        url
      })
      console.log(id)
    }
  }
})