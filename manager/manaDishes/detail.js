// manager/manaDishes/detail.js
const API = require('../../api/mana')
const utils = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryName: '',
    form: {
      name: "",
      price: '',
      isFeatured: false,
    },
    showError: {
      name: false,
      price: false,
    },
    errorMsg: {
      name: "",
      price: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {
      cateId,
      name,
      id
    } = options
    const {
      form
    } = this.data
    form.cateId = cateId
    form.id = id || null
    this.setData({
      form,
      categoryName: name
    })
    if (form.id) this.loadInfo()
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
  doChange(e) {
    const {
      form
    } = this.data
    const fieldName = e.currentTarget.dataset.fieldname
    form[fieldName] = e.detail
    this.setData({
      form
    })
  },
  doSave() {
    const requiredFields = ['name', 'price']
    const {
      showError,
      errorMsg,
      form
    } = this.data
    const errMsg = {
      name: "请填写菜品名称",
      price: "请填写菜品价格"
    };
    for (let i of requiredFields) {
      showError[i] = !form[i]
      errorMsg[i] = !form[i] ? errMsg[i] : ''
      // if (!hasError) break
    }
    // this.setData({
    //   showError,
    //   errorMsg
    // })
    // console.log(Object.values(showError))
    // if (Object.values(showError).includes(false)) return
    this.doSaveDisehd()
  },
  async doSaveDisehd() {
    const {
      form
    } = this.data
    const sendData = form

    const res = await API[sendData.id ? 'editDished' : 'addDished'](sendData)
    if (res.success) {
      utils.successToast()
      wx.navigateBack()
    } else {
      return utils.errToast(res.msg)
    }
  },
  async loadInfo() {
    const {
      form
    } = this.data
    const sendData = form
    const res = await API.getDished(sendData.id)
    if (res.success) {
      res.data.id = sendData.id
      this.setData({
        form: res.data
      })
      // utils.successToast()
      // wx.navigateBack()
    } else {
      return utils.errToast(res.msg)
    }
  }
})