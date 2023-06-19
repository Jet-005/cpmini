const CONFIG = require('config.js')
const AUTH = require('utils/auth')
const token = wx.getStorageSync('token')
const role = wx.getStorageSync('role')
App({
  onLaunch: function () {
    const that = this;
    // 检测新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     */
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          that.globalData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });
    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     */
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000
        })
      } else {
        that.globalData.isConnected = true
        wx.hideToast()
      }
    })

  },
  onShow(e) {
//     AUTH.checkHasLogined().then(async (isLogined) => {
//       if (isLogined) {
// // const 
//       } else {
//         const result = await AUTH.login()
//         if (!result.connectId) {
//           wx.redirectTo({
//             url: 'pages/noConnect/index'
//           })
//         }
//       }
//     })

    // 保存邀请人
    if (e && e.query && e.query.inviter_id) {
      wx.setStorageSync('referrer', e.query.inviter_id)
      if (e.shareTicket) {
        wx.getShareInfo({
          shareTicket: e.shareTicket,
          success: res => {
            console.log(res)
            console.log({
              referrer: e.query.inviter_id,
              encryptedData: res.encryptedData,
              iv: res.iv
            })
            wx.login({
              success(loginRes) {
                if (loginRes.code) {

                } else {
                  console.error('登录失败！' + loginRes.errMsg)
                }
              }
            })
          }
        })
      }
    }
    this.refreshStorageShopInfo()
  },
  async refreshStorageShopInfo() {
    // 刷新本地缓存的门店信息 https://www.yuque.com/apifm/nu0f75/cu4cfi
    let shopInfo = wx.getStorageSync('shopInfo')
    if (!shopInfo) {
      return
    }

    if (res.code == 0) {
      const distance = shopInfo.distance
      shopInfo = res.data.info
      shopInfo.distance = distance
      wx.setStorageSync('shopInfo', shopInfo)
    }
  },
  globalData: {
    isConnected: true,
    token: token,
    role: role
  }
})