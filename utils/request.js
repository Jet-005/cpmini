const config = require('../config.js')
const baseUrl = config.subDomain
// const AUTH = require('./auth.js')
const token = wx.getStorageSync('token')
const userId = wx.getStorageSync('uId')

import Toast from '@vant/weapp/toast/toast';
const request = async (url, method, data = {}, headers = {
  'Authorization': 'Bearer ' + token,
  uid: userId || ''
}) => {
  // if (await AUTH.checkHasLogined()) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url,
      method,
      data,
      header: headers,
      dataType: 'json',
      success: (res) => {
        const resData = res.data
        if (resData.code !== 200) {
          Toast({
            type: 'fail',
            message: resData.msg,
            duration: 3000
          })
        }
        resolve(resData)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
  // } else {
  //   Toast('请重新选择')
  //   // 静默登录
  //   AUTH.login()
  // }

}
const get = (url, params) => {
  return request(url, 'get', params)
}
const post = (url, data) => {
  return request(url, 'post', data)
}
module.exports = {
  get,
  post,
  request // 处理一些不常用的method
}