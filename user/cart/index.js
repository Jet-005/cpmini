// pages/cart/index.js
const API = require('../../api/order')
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartList: [],
    totalPrice: 0,
    select: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const cart = wx.getStorageSync('cart') || []
    const totalPrice = cart.reduce((total, cur) => {
      if (isNaN(cur.nums)) cur.nums = 1
      if (isNaN(cur.price)) cur.price = 0
      return Number(total) + (Number(cur.price) * Number(cur.nums))
    }, 0)
    this.setData({
      cartList: cart,
      totalPrice: totalPrice * 100
    })
  },
  async onSubmit() {
    const products = this.data.cartList.filter((e) => e.checked).map((e) => {
      return {
        _id: e._id,
        quantity: e.nums
      }
    })
    console.log(products)
    const res = await API.createOrder({
      products
    })
    console.log(res)
    if (res.success) {
      Toast.success('提交成功，请继续支付');
      wx.navigateTo({
        url: '/pages/orderMana/index',
      })
    } else {
      Toast.fail(res.msg);
    }
  },
  onChange(event) {
    const {
      detail,
      currentTarget
    } = event
    const index = Number(currentTarget.id)
    const cartList = this.data.cartList
    cartList[index].checked = detail
    this.setData({
      cartList
    })
  },
  onCount(event) {
    const {
      detail,
      currentTarget
    } = event
    const item = this.data.cartList[currentTarget.dataset.index]
    item.nums = detail
    this.setData({
      cartList: this.data.cartList
    })
  },
  toggle() {},
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

  }
})