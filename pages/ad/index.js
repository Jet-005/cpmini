const AUTH = require('../../utils/auth')
const APP = getApp()
APP.configLoadOK = () => {

}

Page({
  data: {
    addressList: [],
    addressEdit: false,
    cancelBtn: false,

    pickerRegionRange: [],
    pickerSelect: [0, 0, 0],
    showRegionStr: '选择行政地址（省、市、区县）',

    addressData: {}
  },
  // 添加地址
  addAddress: function () {
    this.setData({
      addressEdit: true,
      cancelBtn: true,
      id: null,
      addressData: {}
    })
  },
  // 取消编辑
  editCancel: function () {
    this.setData({
      addressEdit: false,
    })
  },
  // 编辑地址
  async editAddress(e) {
    // wx.navigateTo({
    //   url: "/pages/address-add/index?id=" + e.currentTarget.dataset.id
    // })
    var id = e.currentTarget.dataset.id
    this.setData({
      addressEdit: true,
      cancelBtn: false,
      id: id,
    })
    if (id) { // 修改初始化数据库数据

    } else {
      this.initRegionPicker()
    }

  },
  // 选中地址
  selectTap: function (e) {
    var id = e.currentTarget.dataset.id;

  },
  // 删除地址按钮
  deleteAddress: function (e) {
    const _this = this
    const id = e.currentTarget.dataset.id;
    console.log(id)
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {

        } else {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 微信读取
  readFromWx: function () {
    const _this = this
    wx.chooseAddress({
      success: function (res) {
        console.log(res)
        _this.initRegionDB(res.provinceName, res.cityName, res.countyName)
        _this.setData({
          wxaddress: res
        });
      }
    })
  },
  // 获取地址列表
  async initShippingAddress() {
    wx.showLoading({
      title: '',
    })

  },
  // 省市选择器 三栏
  initRegionPicker() {

  },
  async initRegionDB(pname, cname, dname) {
    this.data.showRegionStr = pname + cname + dname
    let pObject = undefined
    let cObject = undefined
    let dObject = undefined
    if (pname) {
      const index = this.data.pickerRegionRange[0].findIndex(ele => {
        return ele.name == pname
      })
      if (index >= 0) {
        this.data.pickerSelect[0] = index
        pObject = this.data.pickerRegionRange[0][index]
      }
    }
    if (!pObject) {
      return
    }



    this.setData({
      pickerRegionRange: this.data.pickerRegionRange,
      pickerSelect: this.data.pickerSelect,
      showRegionStr: this.data.showRegionStr,

    })

  },
  bindchange: function (e) {
    const pObject = this.data.pickerRegionRange[0][e.detail.value[0]]
    const cObject = this.data.pickerRegionRange[1][e.detail.value[1]]
    const dObject = this.data.pickerRegionRange[2][e.detail.value[2]]
    const showRegionStr = pObject.name + cObject.name + dObject.name
    this.setData({
      pObject: pObject,
      cObject: cObject,
      dObject: dObject,
      showRegionStr: showRegionStr
    })
  },
  bindcolumnchange: function (e) {
    const column = e.detail.column
    const index = e.detail.value
    const regionObject = this.data.pickerRegionRange[column][index]
    if (column === 2) {
      this.setData({
        pickerRegionRange: this.data.pickerRegionRange
      })
      return
    }
    if (column === 1) {
      this.data.pickerRegionRange[2] = [{
        name: '请选择'
      }]
    }
    if (column === 0) {
      this.data.pickerRegionRange[1] = [{
        name: '请选择'
      }]
      this.data.pickerRegionRange[2] = [{
        name: '请选择'
      }]
    }
    // // 后面的数组全部清空
    // this.data.pickerRegionRange.splice(column+1)
    // 追加后面的一级数组

  },
  // 
  async provinces(provinceId, cityId, districtId) {



  },
  linkManChange(e) {
    const addressData = this.data.addressData
    addressData.linkMan = e.detail
    this.setData({
      addressData
    })
  },
  mobileChange(e) {
    const addressData = this.data.addressData
    addressData.mobile = e.detail
    this.setData({
      addressData
    })
  },
  addressChange(e) {
    const addressData = this.data.addressData
    addressData.address = e.detail
    this.setData({
      addressData
    })
  },
  // 保存按钮
  async bindSave() {
    const pObject = this.data.pObject
    const cObject = this.data.cObject
    const dObject = this.data.dObject
    const linkMan = this.data.addressData.linkMan
    const address = this.data.addressData.address
    const mobile = this.data.addressData.mobile
    const latitude = this.data.addressData.latitude
    const longitude = this.data.addressData.longitude

    if (!linkMan) {
      wx.showToast({
        title: '请填写用户姓名',
        icon: 'none',
      })
      return
    }
    if (!mobile) {
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none',
      })
      return
    }
    if (!this.data.pObject || !this.data.cObject || !this.data.dObject) {
      wx.showToast({
        title: '请选择行政区划',
        icon: 'none',
      })
      return
    }
    if (!latitude) {
      wx.showToast({
        title: '请选择定位',
        icon: 'none',
      })
      return
    }
    if (!address) {
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none',
      })
      return
    }

    const postData = {
      token: wx.getStorageSync('token'),
      linkMan: linkMan,
      address: address,
      mobile: mobile,
      isDefault: 'true',
      latitude,
      longitude
    }

    // console.log(this.data.pIndex)
    // console.log(this.data.cIndex)
    // console.log(this.data.aIndex)

    postData.provinceId = pObject.id
    postData.cityId = cObject.id
    postData.districtId = dObject.id

    // if (this.data.pIndex >= 0) {
    //   postData.provinceId = pObject.id    
    // }
    // if (this.data.cIndex >= 0) {
    //   postData.cityId = cObject.id  
    // }
    // if (this.data.aIndex >= 0) {
    //   postData.districtId = dObject.id  
    // }    
    let apiResult
    console.log(this.data.id)
    if (this.data.id) {
      postData.id = this.data.id
    } else {}


  },
  onLoad: function (e) {
    const _this = this
    _this.initRegionPicker() // 初始化省市区选择器
    if (e.id) { // 修改初始化数据库数据

    }
  },
  onShow: function () {
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.initShippingAddress();
      } else {
        wx.showModal({
          content: '登陆后才能访问',
          showCancel: false,
          success: () => {
            wx.navigateBack()
          }
        })
      }
    })
  },

  // 判断电话号码格式
  setTelModal: function (e) {
    // console.log(e)    
    var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    // var myreg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;  //判断是否是座机电话

    var isMobile = mobile.exec(e.detail.value)
    //输入有误的话，弹出模态框提示
    if (!isMobile) {
      wx.showModal({
        title: '错误',
        content: '手机号码格式不正确',
        showCancel: false
      })
    }
  },
  chooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        const addressData = this.data.addressData
        addressData.address = res.address + res.name
        addressData.latitude = res.latitude
        addressData.longitude = res.longitude
        this.setData({
          addressData
        })
      },
      fail: (e) => {
        console.error(e)
      },
    })
  }
})