// pages/my/my.js
Page({
  data: {
    balance:0
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://api.it120.cc/lujun/user/amount',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 0) {
          that.setData({
            balance: res.data.data.balance,
            freeze: res.data.data.freeze,
            score: res.data.data.score
          });
        }
      }
    })
  },
  addressList:function(){
    wx.navigateTo({
      url: '../address_list/address_list',
    })
  },
  go_coupon:function(){
    wx.navigateTo({
      url: '../my_coupon/my_coupon',
    })
  },
  go_list:function(){
    wx.navigateTo({
      url: '../my_order/my_order',
    })
  },
  recharge:function(){
    wx.showToast({
      title: '暂不支持哦~~~'
    })
  },
  getPhoneNumber:function(e){
    console.log(e)
  }
})