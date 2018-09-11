// pages/authorization/authorization.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad: function (options) {

  },


  onReady: function () {

  },


  onShow: function () {

  },
  bindGetUserInfo: function (e) {
    if (!e.detail.userInfo) {
      return;
    }
    wx.setStorage({
      key: 'userInfo',
      data: e.detail.userInfo,
    })
    this.login()
  },
  login: function () {
    var that = this;
    if (wx.getStorageSync('token')) {
      wx.request({
        url: 'https://api.it120.cc/lujun/user/check-token',
        data: {
          token: wx.getStorageSync('token')
        },
        success: function (res) {
          console.log(res)
          if (res.data.code != 0) {
            wx.removeStorageSync('token')
            that.login();
          } else {
            // 回到原来的地方放
            wx.navigateBack();
          }
        }
      })
      return;
    }
    wx.login({
      success: function (res) {
        //发起网络请求
        wx.request({
          url: 'https://api.it120.cc/lujun/user/wxapp/login',
          data: {
            code: res.code
          },
          success: function (res) {
            if (res.data.code == 10000) {
              that.register();
              return;
            }
            if (res.data.code != 0) {
              // 登录错误
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '无法登录，请重试',
                showCancel: false
              })
              return;
            }
            wx.setStorage({
              key: 'token',
              data: res.data.data.token,
            })
            wx.setStorage({
              key: 'uid',
              data: res.data.data.uid,
            })
            wx.navigateBack();
          }
        })
      }
    })
  },
  register: function () {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        // wx.getUserInfo({
        //   success: function (res) {
        //     var encryptedData = res.encryptedData;
        //     var iv = res.iv;
        //     wx.request({
        //       url: 'https://api.it120.cc/lujun/user/wxapp/register/complex',
        //       data: {
        //         code: code, encryptedData: encryptedData, iv: iv
        //       },
        //       success: function (res) {
        //         that.login();
        //       }
        //     })
        //   }
        // })
        //发起网络请求
      }
    });
  },
})