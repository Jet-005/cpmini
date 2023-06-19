// components/login/index.js
const AUTH = require('../../utils/auth')
const utils = require('../../utils/util')

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: true
  },
  /* 组件的生命周期 */
  lifetimes: {
    created() {
      this.getTabBar().setData({
        show: false
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    doLogin() {
      AUTH.checkHasLogined().then(async (isLogined) => {
        let curRole = isLogined ? utils.getRole() : ''
        if (!isLogined) {
          const role = await AUTH.login().role
          curRole = role ? role : ''
          // 没有角色就跳转至未连接页
          if (!role) {
            wx.redirectTo({
              url: '../../commonPage/noConnect/index'
            })
          }
        }
        this.setData({
          show: false
        })
        if (!curRole) return
        this.getTabBar().setData({
          show: true,
          curRole
        })
      })
    }
  }
})