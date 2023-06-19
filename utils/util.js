const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const notEmptyObj = obj => {
  return Object.keys(obj).length
}
const getStorageSync = (key) => {
  return wx.getStorageSync(key)
}
const getRole = () => {
  const role = getStorageSync('role')
  return role || ''
}
const errToast = (msg) => {
  wx.showToast({
    title: msg,
    icon: 'none'
  })
}
const successToast = (msg = '操作成功') => {
  wx.showToast({
    title: msg,
    icon: 'success'
  })
}
module.exports = {
  formatTime: formatTime,
  notEmptyObj,
  getStorageSync,
  getRole,
  errToast,
  successToast
}