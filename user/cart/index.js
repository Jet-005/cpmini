// pages/cart/index.js
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
  onSubmit() {},
  onChange(event) {
    const {
      detail
    } = event
    const cartList = this.data.cartList
    for (let e of cartList) {
      e.checked = detail.includes(e._id)
    }
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