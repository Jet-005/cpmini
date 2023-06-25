// components/login/index.js
const AUTH = require('../../utils/auth')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hasRole: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
  },
  /* 组件的生命周期 */
  pageLifetimes: {
    show() {

    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    async doLogin() {
      const data = await AUTH.login()
      wx.setStorageSync('token', data.token || '')
      wx.setStorageSync('role', data.role || '') // role-用来分辨角色
      wx.setStorageSync('uId', data._id || '') // userId-用来查询用户数据
      wx.setStorageSync('cId', data.connectId || '') // connectId-用来查询配对用户信息
      this.setData({
        show: false
      })
      // 没有角色就跳转至未连接页
      if (!data.role) {
        wx.redirectTo({
          url: '../../commonPage/noConnect/index'
        })
        return
      }
      this.triggerEvent('login', data)
    }
  }
})