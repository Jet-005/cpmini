// pages/orderMana/index.js
const API = require('../../api/order')
const utils = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValues: '',
    active: 'all',
    page: 1,
    curRole: utils.getRole()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    this.loadList()
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
  onClick(e) {
    const {
      name,
    } = e.detail
    this.setData({
      active: name
    })
    this.loadList()
  },
  async loadList() {
    const {
      active,
      searchValues,
      page
    } = this.data
    const sendData = {
      status: active,
      page
    }
    searchValues && (sendData.search = searchValues)
    const res = await API.getUserOrderList(sendData)
  }
})