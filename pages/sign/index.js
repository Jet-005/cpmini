const AUTH = require('../../utils/auth')

Page({
  data: {
    minDate: new Date().getTime(),
    maxDate: new Date().getTime(),
    formatter(day) {
      return day;
    },
  },
  onLoad: function (options) {
    this.scoreSignLogs()
  },
  onShow: function () {
    AUTH.checkHasLogined().then(isLogined => {
      if (!isLogined) {
        AUTH.login(this)
      }
    })
  },
  async scoreSignLogs() {

  },
  async sign() {

  },
})