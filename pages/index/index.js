const APP = getApp()
const AUTH = require('../../utils/auth')
const API = require('../../api/index')

Page({
  data: {
    role: 0, // 0-未配对,1-xx,2-xx
    page: 1,
    peisongType: 'zq', // zq 自取，kd 配送
    showCartPop: false, // 是否显示购物车列表
    showGoodsDetailPOP: false, // 是否显示商品详情
    showCouponPop: false, // 是否弹出优惠券领取提示
    shopIsOpened: false, // 是否营业
    showPingtuanPop: false,
    share_goods_id: undefined,
    share_pingtuan_open_id: undefined,
    lijipingtuanbuy: false,
    pingtuan_open_id: undefined,
    mainActiveIndex: 0,
    activeId: [],
    categories: [{
      // 导航名称
      text: "浙江",
      id: 1
    }, {
      // 导航名称
      text: "江苏",
      id: 2
    }],
    goods: [{
        // 名称
        text: '温州',
        // id，作为匹配选中状态的标识
        id: 1,
        pic: 'https://img.yzcdn.cn/vant/apple-1.jpg',
        price: 10
      },
      {
        text: '杭州',
        id: 2,
        pic: 'https://img.yzcdn.cn/vant/apple-1.jpg',
        price: 10

      }
    ]
  },
  onLoad: function (e) {
    let mod = 0 // 0 普通模式； 1 扫码点餐模式
    if (e && e.scene) {
      const scene = decodeURIComponent(e.scene) // 处理扫码进商品详情页面的逻辑
      if (scene && scene.split(',').length == 3) {
        // 扫码点餐
        const scanDining = {}
        scene.split(',').forEach(ele => {
          scanDining[ele.split('=')[0]] = ele.split('=')[1]
        })
        wx.setStorageSync('scanDining', scanDining)
        this.setData({
          scanDining: scanDining
        })
        this.cyTableToken(scanDining.id, scanDining.key)
        mod = 1
      } else {
        wx.removeStorageSync('scanDining')
      }
    }
    if (wx.getStorageSync('scanDining')) {
      mod = 1
      this.setData({
        scanDining: wx.getStorageSync('scanDining')
      })
      wx.hideTabBar()
    }
    if (e.share_goods_id) {
      this.data.share_goods_id = e.share_goods_id
      this._showGoodsDetailPOP(e.share_goods_id)
    }
    if (e.share_pingtuan_open_id) {
      this.data.share_pingtuan_open_id = e.share_pingtuan_open_id
    } else {
      this._showCouponPop()
    }
    // 静默式授权注册/登陆
    // if (mod == 0) {
    //   AUTH.checkHasLogined().then(isLogin => {
    //     if (isLogin) {
    //       AUTH.bindSeller()
    //     } else {
    //       AUTH.authorize().then(res => {
    //         AUTH.bindSeller()
    //       })
    //     }
    //   })
    // }
    // 设置标题
    const mallName = wx.getStorageSync('mallName')
    if (mallName) {
      wx.setNavigationBarTitle({
        title: mallName
      })
    }
    APP.configLoadOK = () => {
      const mallName = wx.getStorageSync('mallName')
      if (mallName) {
        wx.setNavigationBarTitle({
          title: mallName
        })
      }
    }
    // 读取默认配送方式
    let peisongType = wx.getStorageSync('peisongType')
    if (!peisongType) {
      peisongType = 'zq'
      wx.setStorageSync('peisongType', peisongType)
    }
    this.setData({
      peisongType
    })
    // 读取最近的门店数据
    // this.getCategories()    
    this.noticeLastOne()
    this.banners()
  },
  onShow: function () {
    this.shippingCarInfo()
    const refreshIndex = wx.getStorageSync('refreshIndex')
    if (refreshIndex) {
      this.getshopInfo()
      wx.removeStorageSync('refreshIndex')
    }
  },
  async cyTableToken(tableId, key) {

    wx.hideTabBar()
    wx.setStorageSync('uid', res.data.uid)
    wx.setStorageSync('token', res.data.token)
  },
  async getshopInfo() {
    let shopInfo = wx.getStorageSync('shopInfo')
    if (shopInfo) {
      this.setData({
        shopInfo: shopInfo,
        shopIsOpened: this.checkIsOpened(shopInfo.openingHours)
      })
      const shop_goods_split = wx.getStorageSync('shop_goods_split')
      if (shop_goods_split == '1') {
        // 商品需要区分门店
        wx.setStorageSync('shopIds', shopInfo.id) // 当前选择的门店
        this.getGoodsList()
      }
      return
    }
    wx.getLocation({
      type: 'wgs84', //wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: (res) => {
        // console.log(res)
        this.data.latitude = res.latitude
        this.data.longitude = res.longitude
        this.fetchShops(res.latitude, res.longitude, '')
      },
      fail(e) {
        if (e.errMsg.indexOf('fail auth deny') != -1) {
          AUTH.checkAndAuthorize('scope.userLocation')
        } else {
          wx.showModal({
            title: '出错了~',
            content: e.errMsg,
            showCancel: false
          })
        }
      }
    })
  },
  async fetchShops(latitude, longitude, kw) {

  },
  async _showCouponPop() {
    const a = wx.getStorageSync('has_pop_coupons')
    if (a) {
      return
    }
    // 检测是否需要弹出优惠券的福袋

  },
  changePeisongType(e) {
    const peisongType = e.currentTarget.dataset.type
    this.setData({
      peisongType
    })
    wx.setStorage({
      data: peisongType,
      key: 'peisongType',
    })
  },
  // 获取分类
  async getCategories() {
    const res = await API.getCategories()
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    this.setData({
      page: 1,
      categories: res.data,
      categorySelected: res.data[0]
    })
    if (shop_goods_split != '1') {
      this.getGoodsList()
    }
  },
  async getGoodsList() {
    const {
      mainActiveIndex,
      categories
    } = this.data
    const curNav = categories[mainActiveIndex]
    wx.showLoading({
      title: '',
    })

    wx.hideLoading()

    if (this.data.page == 1) {
      this.setData({})
    } else {
      this.setData({})
    }
    // this.processBadge()
  },
  _onReachBottom() {
    this.data.page++
    this.getGoodsList()
  },
  categoryNavClick(e) {
    this.setData({
      mainActiveIndex: e.detail || 0
    });
    // 获取商品信息
    // this.getGoodsList()
  },
  categoryItemClick(e) {
    const {
      activeId
    } = this.data
    const {
      id
    } = e.detail
    if (activeId.includes(id)) return // 如果已经是勾选了,无需处理 2023.05.05
    activeId.push(id)
    console.log(e, '=== categoryClick')
    // const index = e.currentTarget.dataset.idx
    // const categorySelected = this.data.categories[index]
    // this.setData({
    //   page: 1,
    //   categorySelected,
    //   scrolltop: 0
    // })
    // this.getGoodsList()


  },
  async shippingCarInfo() {

    // this.processBadge()
  },
  showCartPop() {
    if (this.data.scanDining) {
      // 扫码点餐，前往购物车页面
      wx.navigateTo({
        url: '/pages/cart/index',
      })
    } else {
      this.setData({
        showCartPop: !this.data.showCartPop
      })
    }
  },
  hideCartPop() {
    this.setData({
      showCartPop: false
    })
  },
  async addCart1(e) {
    const token = wx.getStorageSync('token')
    const index = e.currentTarget.dataset.idx
    const item = this.data.goods[index]
    wx.showLoading({
      title: '',
    })
    let number = item.minBuyNumber // 加入购物车的数量
    if (this.data.shippingCarInfo && this.data.shippingCarInfo.items) {
      const goods = this.data.shippingCarInfo.items.find(ele => {
        return ele.goodsId == item.id
      })
      console.log(goods);
      if (goods) {
        number = 1
      }
    }
    wx.hideLoading()

    this.shippingCarInfo()
  },
  async skuClick(e) {
    const index1 = e.currentTarget.dataset.idx1
    const index2 = e.currentTarget.dataset.idx2
    const curGoodsMap = this.data.curGoodsMap
    curGoodsMap.properties[index1].childsCurGoods.forEach(ele => {
      ele.selected = false
    })
    curGoodsMap.properties[index1].childsCurGoods[index2].selected = true
    this.setData({
      curGoodsMap
    })
    this.calculateGoodsPrice()
  },
  async calculateGoodsPrice() {
    const curGoodsMap = this.data.curGoodsMap
    // 计算最终的商品价格
    let price = curGoodsMap.basicInfo.minPrice
    let originalPrice = curGoodsMap.basicInfo.originalPrice
    let totalScoreToPay = curGoodsMap.basicInfo.minScore
    let buyNumMax = curGoodsMap.basicInfo.stores
    let buyNumber = curGoodsMap.basicInfo.minBuyNumber
    if (this.data.shopType == 'toPingtuan') {
      price = curGoodsMap.basicInfo.pingtuanPrice
    }
    // 计算 sku 价格
    const canSubmit = this.skuCanSubmit()
    if (canSubmit) {
      let propertyChildIds = "";
      if (curGoodsMap.properties) {
        curGoodsMap.properties.forEach(big => {
          const small = big.childsCurGoods.find(ele => {
            return ele.selected
          })
          propertyChildIds = propertyChildIds + big.id + ":" + small.id + ","
        })
      }

    }
    // 计算配件价格
    if (this.data.goodsAddition) {
      this.data.goodsAddition.forEach(big => {
        big.items.forEach(small => {
          if (small.active) {
            price = (price * 100 + small.price * 100) / 100
          }
        })
      })
    }
    curGoodsMap.price = price
    this.setData({
      curGoodsMap
    });
  },
  async skuClick2(e) {
    const propertyindex = e.currentTarget.dataset.idx1
    const propertychildindex = e.currentTarget.dataset.idx2

    const goodsAddition = this.data.goodsAddition
    const property = goodsAddition[propertyindex]
    const child = property.items[propertychildindex]
    if (child.active) {
      // 该操作为取消选择
      child.active = false
      this.setData({
        goodsAddition
      })
      this.calculateGoodsPrice()
      return
    }
    // 单选配件取消所有子栏目选中状态
    if (property.type == 0) {
      property.items.forEach(child => {
        child.active = false
      })
    }
    // 设置当前选中状态
    child.active = true
    this.setData({
      goodsAddition
    })
    this.calculateGoodsPrice()
  },
  skuCanSubmit() {
    const curGoodsMap = this.data.curGoodsMap
    let canSubmit = true
    if (curGoodsMap.properties) {
      curGoodsMap.properties.forEach(big => {
        const small = big.childsCurGoods.find(ele => {
          return ele.selected
        })
        if (!small) {
          canSubmit = false
        }
      })
    }
    return canSubmit
  },
  additionCanSubmit() {
    const curGoodsMap = this.data.curGoodsMap
    let canSubmit = true
    if (curGoodsMap.basicInfo.hasAddition) {
      this.data.goodsAddition.forEach(ele => {
        if (ele.required) {
          const a = ele.items.find(item => {
            return item.active
          })
          if (!a) {
            canSubmit = false
          }
        }
      })
    }
    return canSubmit
  },
  async addCart2() {
    const token = wx.getStorageSync('token')
    const curGoodsMap = this.data.curGoodsMap
    const canSubmit = this.skuCanSubmit()
    const additionCanSubmit = this.additionCanSubmit()
    if (!canSubmit || !additionCanSubmit) {
      wx.showToast({
        title: '请选择规格',
        icon: 'none'
      })
      return
    }
    const sku = []
    if (curGoodsMap.properties) {
      curGoodsMap.properties.forEach(big => {
        const small = big.childsCurGoods.find(ele => {
          return ele.selected
        })
        sku.push({
          optionId: big.id,
          optionValueId: small.id
        })
      })
    }
    const goodsAddition = []
    if (curGoodsMap.basicInfo.hasAddition) {
      this.data.goodsAddition.forEach(ele => {
        ele.items.forEach(item => {
          if (item.active) {
            goodsAddition.push({
              id: item.id,
              pid: item.pid
            })
          }
        })
      })
    }
    wx.showLoading({
      title: '',
    })
    wx.hideLoading()

    this.hideGoodsDetailPOP()
    this.shippingCarInfo()
  },
  async cartStepChange(e) {
    const token = wx.getStorageSync('token')
    const index = e.currentTarget.dataset.idx
    const item = this.data.shippingCarInfo.items[index]
    if (e.detail < 1) {
      // 删除商品
      wx.showLoading({
        title: '',
      })
      wx.hideLoading()

      // this.processBadge()
    } else {
      // 修改数量
      wx.showLoading({
        title: '',
      })
      wx.hideLoading()

      this.shippingCarInfo()
    }
  },
  goodsStepChange(e) {
    const curGoodsMap = this.data.curGoodsMap
    curGoodsMap.number = e.detail
    this.setData({
      curGoodsMap
    })
  },
  async clearCart() {
    wx.showLoading({
      title: '',
    })
    wx.hideLoading()

    this.shippingCarInfo()
  },
  async showGoodsDetailPOP(e) {
    const index = e.currentTarget.dataset.idx
    const goodsId = this.data.goods[index].id
    this._showGoodsDetailPOP(goodsId)
    this.goodsAddition(goodsId)
  },
  async _showGoodsDetailPOP(goodsId) {
    const token = wx.getStorageSync('token')

    wx.hideTabBar()


  },
  hideGoodsDetailPOP() {
    this.setData({
      showGoodsDetailPOP: false,
      showPingtuanPop: false
    })
    if (!this.data.scanDining) {
      wx.showTabBar()
    }
  },
  goPay() {
    if (this.data.scanDining) {
      // 扫码点餐，前往购物车
      wx.navigateTo({
        url: '/pages/cart/index',
      })
    } else {
      wx.navigateTo({
        url: '/pages/pay/index',
      })
    }
  },
  onShareAppMessage: function () {
    let uid = wx.getStorageSync('uid')
    if (!uid) {
      uid = ''
    }
    let path = '/pages/index/index?inviter_id=' + uid
    if (this.data.pingtuan_open_id) {
      path = path + '&share_goods_id=' + this.data.curGoodsMap.basicInfo.id + '&share_pingtuan_open_id=' + this.data.pingtuan_open_id
    }
    return {
      title: '"' + wx.getStorageSync('mallName') + '" ' + wx.getStorageSync('share_profile'),
      path
    }
  },
  couponOverlayClick() {
    this.setData({
      showCouponPop: false
    })
  },
  couponImageClick() {
    wx.navigateTo({
      url: '/pages/coupons/index',
    })
  },
  async noticeLastOne() {

  },
  goNotice(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/notice/detail?id=' + id,
    })
  },
  async banners() {

  },
  tapBanner(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.navigateTo({
        url
      })
    }
  },
  checkIsOpened(openingHours) {
    if (!openingHours) {
      return true
    }
    const date = new Date();
    const startTime = openingHours.split('-')[0]
    const endTime = openingHours.split('-')[1]
    const dangqian = date.toLocaleTimeString('chinese', {
      hour12: false
    })

    const dq = dangqian.split(":")
    const a = startTime.split(":")
    const b = endTime.split(":")

    const dqdq = date.setHours(dq[0], dq[1])
    const aa = date.setHours(a[0], a[1])
    const bb = date.setHours(b[0], b[1])

    if (a[0] * 1 > b[0] * 1) {
      // 说明是到第二天
      return !this.checkIsOpened(endTime + '-' + startTime)
    }
    return aa < dqdq && dqdq < bb
  },
  yuanjiagoumai() {
    this.setData({
      showPingtuanPop: false,
      showGoodsDetailPOP: true
    })
  },
  _lijipingtuanbuy() {
    const curGoodsMap = this.data.curGoodsMap
    curGoodsMap.price = curGoodsMap.basicInfo.pingtuanPrice
    this.setData({
      curGoodsMap,
      showPingtuanPop: false,
      showGoodsDetailPOP: true,
      lijipingtuanbuy: true
    })
  },
  pingtuanbuy() {
    // 加入 storage 里
    const curGoodsMap = this.data.curGoodsMap
    const canSubmit = this.skuCanSubmit()
    const additionCanSubmit = this.additionCanSubmit()
    if (!canSubmit || !additionCanSubmit) {
      wx.showToast({
        title: '请选择规格',
        icon: 'none'
      })
      return
    }
    const sku = []
    if (curGoodsMap.properties) {
      curGoodsMap.properties.forEach(big => {
        const small = big.childsCurGoods.find(ele => {
          return ele.selected
        })
        sku.push({
          optionId: big.id,
          optionValueId: small.id,
          optionName: big.name,
          optionValueName: small.name
        })
      })
    }
    const additions = []
    if (curGoodsMap.basicInfo.hasAddition) {
      this.data.goodsAddition.forEach(ele => {
        ele.items.forEach(item => {
          if (item.active) {
            additions.push({
              id: item.id,
              pid: item.pid,
              pname: ele.name,
              name: item.name
            })
          }
        })
      })
    }
    const pingtuanGoodsList = []
    pingtuanGoodsList.push({
      goodsId: curGoodsMap.basicInfo.id,
      number: curGoodsMap.number,
      categoryId: curGoodsMap.basicInfo.categoryId,
      shopId: curGoodsMap.basicInfo.shopId,
      price: curGoodsMap.price,
      score: curGoodsMap.basicInfo.score,
      pic: curGoodsMap.basicInfo.pic,
      name: curGoodsMap.basicInfo.name,
      minBuyNumber: curGoodsMap.basicInfo.minBuyNumber,
      logisticsId: curGoodsMap.basicInfo.logisticsId,
      sku,
      additions
    })
    wx.setStorageSync('pingtuanGoodsList', pingtuanGoodsList)
    // 跳转
    wx.navigateTo({
      url: '/pages/pay/index?orderType=buyNow&pingtuanOpenId=' + this.data.pingtuan_open_id,
    })
  },
  _lijipingtuanbuy2() {
    this.data.share_pingtuan_open_id = null
    this._showGoodsDetailPOP(this.data.curGoodsMap.basicInfo.id)
  },
  async goodsAddition(goodsId) {

  },
  tabbarChange(e) {
    if (e.detail == 1) {
      wx.navigateTo({
        url: '/pages/cart/index',
      })
    }
    if (e.detail == 2) {
      wx.navigateTo({
        url: '/pages/cart/order',
      })
    }
  },
  // 显示分类和商品数量徽章
  processBadge() {
    const categories = this.data.categories
    const goods = this.data.goods
    const shippingCarInfo = this.data.shippingCarInfo
    if (!categories) {
      return
    }
    if (!goods) {
      return
    }
    categories.forEach(ele => {
      ele.badge = 0
    })
    goods.forEach(ele => {
      ele.badge = 0
    })
    if (shippingCarInfo) {
      shippingCarInfo.items.forEach(ele => {
        if (ele.categoryId) {
          const category = categories.find(a => {
            return a.id == ele.categoryId
          })
          if (category) {
            category.badge += ele.number
          }
        }
        if (ele.goodsId) {
          const _goods = goods.find(a => {
            return a.id == ele.goodsId
          })
          if (_goods) {
            _goods.badge += ele.number
          }
        }
      })
    }
    this.setData({
      categories,
      goods
    })
  },
  selectshop() {
    wx.navigateTo({
      url: '/pages/shop/select?type=index',
    })
  },
  goGoodsDetail(e) {
    const index = e.currentTarget.dataset.idx
    const goodsId = this.data.goods[index].id
    wx.navigateTo({
      url: '/pages/goods-details/index?id=' + goodsId,
    })
  },
})