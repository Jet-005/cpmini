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
      res.data.forEach((e) => {
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
      const res = await APICom.getDishedsByCategory(curNav._id, dishPage)
      // res.data.forEach((e) => {
      //   e.text = e.name
      //   e.id = e._id
      // })
      // curNav.children = res.data
      this.setData({
        categories,
        disheds: res.data
      })

    },
  }
})