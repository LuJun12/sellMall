// pages/shopping_cart/shopping_cart.js
Page({
  data: {
    cartInfo: '',
    isActives: false,
    currentIndex: null,
    isselect: false,
    totalPrice: 0,
    num: 0,
    isdel: false,
    is: false,
    hasgood:false
  },
  onLoad: function(options) {},
  // onPullDownRefresh: function() {
  //   wx.showNavigationBarLoading()
  //   this.onShow()
  // },
  onShow: function() {
    var that = this;
    var o_id=0;
    wx.getStorage({
      key: 'cartInfo',
      success: function(res) {
        // wx.stopPullDownRefresh();
        // wx.hideNavigationBarLoading();
          that.setData({
            cartInfo: res.data,
            isdel: false,
            isactives: false,
            isselect: false,
            hasgood: true
          }) 
      }
    })
  },
  go_buy: function() {
    wx.navigateTo({
      url: '../shouye/shouye',
    })
  },
  //全选
  selectTaps: function(e) {
    var indexId = e.currentTarget.dataset.id
    var cartInfoList = this.data.cartInfo;
    var total = 0;
    for (var i = 0; i < cartInfoList.length; i++) {
      if (this.data.isactives == true) {
        cartInfoList[i].active = false
        this.setData({
          isselect: false
        })
      } else {
        cartInfoList[i].active = true;
        total += parseFloat(cartInfoList[i].price) * (cartInfoList[i].selectNum);
        this.setData({
          isselect: true,
          totalPrice: total
        })
      }
    }
    this.setData({
      cartInfo: cartInfoList,
      isactives: !this.data.isactives
    })
  },
  //单选
  selectTap: function(e) {
    var currentIndex = e.currentTarget.dataset.index;
    var total = 0;
    this.setData({
      currentIndex: currentIndex
    })
    var cartInfoList = this.data.cartInfo;
    if (currentIndex !== "" && currentIndex != null) {
      cartInfoList[currentIndex].active = !cartInfoList[currentIndex].active,
        this.setData({
          cartInfo: cartInfoList
        })
      if (cartInfoList[currentIndex].active == true) {
        this.setData({
          isselect: true
        })
      } else {
        this.setData({
          isselect: false
        })
      }
    }
    for (var i = 0; i < cartInfoList.length; i++) {
      if (cartInfoList[i].active == false) {
        this.setData({
          isactives: false
        })
        break;
      } else {
        total += cartInfoList[i].price * cartInfoList[i].selectNum;
        this.setData({
          totalPrice: total,
          isselect: true,
          isactives: true
        })
      }
    }
  },
  go_account: function() {
    var buy_goods = []
    var select_order=[]
    for (var i = 0; i < this.data.cartInfo.length; i++) {
      if (this.data.cartInfo[i].active) {
        buy_goods.push(this.data.cartInfo[i]);
      }
    }
    wx.setStorage({
      key: 'buyInfo',
      data: buy_goods,
    })
    wx.setStorage({
      key: 'totalPrice',
      data: this.data.totalPrice,
    })
    if (this.data.isselect == true) {
      wx.navigateTo({
        url: '../wait_pay/wait_pay?totalPrice=' + this.data.totalPrice,
      })
    } else {
      wx.showToast({
        title: '请选择结算的商品',
        icon: 'none'
      })
    }
  },
  //加1
  addnum: function(e) {
    var total = 0;
    var index = e.currentTarget.dataset.index;
    var num = this.data.cartInfo[index].selectNum;
    var that = this
    if (num > 0) {
      num++;
    }
    var cartInfo = this.data.cartInfo
    this.data.cartInfo[index].selectNum = num;
    this.setData({
      cartInfo: cartInfo
    })
    for (var i = 0; i < cartInfo.length; i++) {
      if (cartInfo[i].active == false) {
        this.setData({
          isactives: false
        })
      } else {
        total += cartInfo[i].price * cartInfo[i].selectNum;
        this.setData({
          isactives: true,
          totalPrice: total
        })
      }
    }
  },
  //减1
  delnum: function(e) {
    var total = 0;
    var index = e.currentTarget.dataset.index;
    var num = this.data.cartInfo[index].selectNum;
    var that = this
    if (num > 1) {
      num--;
    }
    var cartInfo = this.data.cartInfo
    this.data.cartInfo[index].selectNum = num;
    this.setData({
      cartInfo: cartInfo
    })
    for (var i = 0; i < cartInfo.length; i++) {
      if (cartInfo[i].active == false) {
        this.setData({
          isactives: false
        })
      } else {
        total += cartInfo[i].price * cartInfo[i].selectNum;
        this.setData({
          isactives: true,
          totalPrice: total
        })
      }
    }
  },
  editTap: function() {
    this.setData({
      isdel: !this.data.isdel,
      isselect: false
    })
  },
  del_tap: function() {
    var cartInfo = this.data.cartInfo
    cartInfo = cartInfo.filter(function(curGoods) {
      return !curGoods.active;
    });
    wx.showToast({
      title: '删除成功',
      icon: 'success',
      duration: 2000
    })
    this.setData({
      cartInfo: cartInfo,
      isactives: false,
      isselect: false
    })
    wx.setStorage({
      key: 'cartInfo',
      data: cartInfo,
    })
    if (this.data.cartInfo.length > 0) {
      this.setData({
        is: true
      })
    } else {
      this.setData({
        is: false
      })
    }
  }
})