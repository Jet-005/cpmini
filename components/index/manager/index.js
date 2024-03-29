// components/manager1/index.js
const API = require('../../../api/mana')
const utils = require('../../../utils/util')

Component({
  // options: {
  //   styleIsolation: 'apply-shared',
  // },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    page: 1,
    categories: [],
    total: 0
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
  pageLifetimes: {
    show() {
      // 组件所在页面的show生命周期
      this.getCategories()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    newCategories() {
      wx.navigateTo({
        url: "../../manager/category/new"
      })
    },
    editCategories(e) {
      const {
        id
      } = e.currentTarget.dataset
      wx.navigateTo({
        url: `../../manager/category/new?id=${id}`
      })
    },
    manageDishes(e) {
      const {
        id,
        name
      } = e.currentTarget.dataset
      wx.navigateTo({
        url: `../../manager/manaDishes/index?id=${id}&name=${name}`
      })
    },
    // 获取分类
    async getCategories() {
      const res = await API.getCategories(this.data.page)
      if (!res.success) {
        return utils.errToast(res.msg)
      }
      this.setData({
        categories: res.data,
        total: res.count
      })
    },
  }
})