// manager/category/new.js
const API = require('../../api/mana')
const utils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    errorMsg: "",
    id: null,
    showError: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id) {
      this.data.id = options.id
      this.getCategoryInfo()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  onChange(e) {
    this.setData({
      name: e.detail
    })

  },
  doSave() {
    console.log(this.data.name)
    if (!this.data.name) {
      this.setData({
        showError: true,
        errorMsg: "请输入分类名称"
      })
      return
    }
    this.doSaveCategories()
  },
  async doSaveCategories() {
    const {
      name,
      id
    } = this.data
    const sendData = {
      name
    }
    if (id) {
      sendData.id = id
    }
    const res = await API[id ? 'editCategories' : 'saveCategories'](sendData)
    if (res.success) {
      utils.successToast()
      wx.navigateBack()
    } else {
      return utils.errToast(res.msg)
    }

  },
  async getCategoryInfo() {
    const res = await API.getCategoryInfo()
    if (res.success) {
      this.setData({
        name: res.data.name
      })
    } else {
      return utils.errToast(res.msg)
    }
  },
  async doEditCategories() {},
  formSubmit(e) {
    console.log(e, 'formSubmit')
  }
})