const request = require('./request')
const token = wx.getStorageSync('token')
const API = require('../api/login.js')
const utils = require('./util')

async function checkSession() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        return resolve(true)
      },
      fail() {
        return resolve(false)
      }
    })
  })
}
// 查看当前登录用户的身份
async function checkRole() {
  const res = await request()
}
async function bindSeller() {
  // const token = wx.getStorageSync('token')
  const referrer = wx.getStorageSync('referrer')
  if (!token) {
    return
  }
  if (!referrer) {
    return
  }
}

// 检测登录状态，返回 true / false
async function checkHasLogined() {
  const token = wx.getStorageSync('token')
  if (!token) {
    return false
  }
  const loggined = await checkSession()
  if (!loggined) {
    wx.removeStorageSync('token')
    return false
  }
  return true
}

async function wxaCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        return resolve(res.code)
      },
      fail() {
        wx.showToast({
          title: '获取code失败',
          icon: 'none'
        })
        return resolve('获取code失败')
      }
    })
  })
}

async function login() {
  const code = await wxaCode()
  const sendData = {
    code
  }
  const {
    data
  } = await API.login(sendData)
  return data
}

async function authorize() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (res) {
        let referrer_storge = wx.getStorageSync('referrer');
        if (referrer_storge) {
          referrer = referrer_storge;
        }
        // 下面开始调用注册接口
        const componentAppid = wx.getStorageSync('componentAppid')
        if (componentAppid) {

        } else {

        }
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

function loginOut() {
  wx.removeStorageSync('token')
  wx.removeStorageSync('uId')
  wx.removeStorageSync('cId')
  wx.removeStorageSync('role')
}

async function checkAndAuthorize(scope) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          wx.authorize({
            scope: scope,
            success() {
              resolve() // 无返回参数
            },
            fail(e) {
              console.error(e)
              // if (e.errMsg.indexof('auth deny') != -1) {
              //   wx.showToast({
              //     title: e.errMsg,
              //     icon: 'none'
              //   })
              // }
              wx.showModal({
                title: '无权操作',
                content: '需要获得您的授权',
                showCancel: false,
                confirmText: '立即授权',
                confirmColor: '#e64340',
                success(res) {
                  wx.openSetting();
                },
                fail(e) {
                  console.error(e)
                  reject(e)
                },
              })
            }
          })
        } else {
          resolve() // 无返回参数
        }
      },
      fail(e) {
        console.error(e)
        reject(e)
      }
    })
  })
}

module.exports = {
  checkHasLogined: checkHasLogined,
  wxaCode: wxaCode,
  loginOut: loginOut,
  checkAndAuthorize: checkAndAuthorize,
  authorize: authorize,
  bindSeller: bindSeller,
  checkRole: checkRole,
  login
}