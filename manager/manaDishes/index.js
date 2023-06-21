// manager/manaDishes/index.js
const API = require('../../api/mana')
const utils = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateId: '',
    page: 1,
    disheds:[]
  },

  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad(options) {
    this.setData({
      id: options.id
    })
    this.getDisheds()
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
  newManaDishes() {
    wx.navigateTo({
      url: '../manaDishes/detail',
    })
  },
  manageDishesDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../manaDishes/detail?id=${id}`,
    })
  },
  doChangeStatus(e) {
    const id = e.currentTarget.dataset.id
  },
  // 获取分类下的菜品
  async getDisheds() {
    const {
      page,
      cateId
    } = this.data
    const res = await API.getDishedsByCategory(cateId, page)
    if (!res.success) {
      return utils.errToast(res.msg)
    }
    this.setData({
      disheds: res.data,
    })
  },
})