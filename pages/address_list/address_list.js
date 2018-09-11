// pages/address_list/address_list.js
var app=getApp();
Page({

  
  data: {
    isfalse:false
  
  },
  onLoad: function (options) {
  
  },

  onShow: function () {
    var that=this;
  wx.request({
    url: 'https://api.it120.cc/lujun/user/shipping-address/list',
    data: {
      token: app.globalData.token
    },
    success:function(res){
      console.log(res)
      that.setData({
        address_list:res.data.data
      })
    }
  })
  },
  selectAddress:function(e){
  var id=e.currentTarget.dataset.index;
  wx.request({
    url: 'https://api.it120.cc/lujun/user/shipping-address/update',
    data:{
      token: app.globalData.token,
      id:id,
      isDefault: 'true'
    },
    success:function(res){
      wx.navigateBack({})
    }
  })
  },
  edit_address:function(e){
    wx.navigateTo({
      url: "../address_edit/address_edit?id=" + e.currentTarget.dataset.id
    })
  },
  add:function(){
    wx.navigateTo({
      url: '../add_address/add_address',
    })
  }
})