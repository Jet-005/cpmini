// components/login/index.js
const AUTH = require('utils/auth')

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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    login() {
      AUTH.checkHasLogined().then(async (isLogined) => {
        if (isLogined) {
        } else {
          const result = await AUTH.login()
          if (!result.connectId) {
            wx.redirectTo({
              url: 'pages/noConnect/index'
            })
          }
        }
      })
    }
  }
})