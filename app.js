//app.js
App({
  onLaunch: function () {
    // 登录
    var that=this;
    this.login();
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token',
      data: {
        grant_type: 'client_credential',
        appid: 'wx1a27815b8b9b7dd3',
        secret: '285c436eb751f37fdfe536e5be6ac225'
      },
      success: function (res) {
        // console.log(res)
        that.globalData.access_token= res.data.access_token
      }
    })
  },
  login: function () {
    var that=this;
    if (that.globalData.token) {
      wx.request({
        url: 'https://api.it120.cc/lujun/user/check-token',
        data: {
          token: that.globalData.token
        },
        success: function (res) {
          console.log(res)
          if (res.data.code != 0) {
            that.globalData.token = null;
            that.login();
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
              console.log(res)
              if (res.data.code == 10000){
                that.register();
                return;
              }
              if (res.data.code != 0) {
                // 登录错误
                wx.showModal({
                  title: '提示',
                  content: '无法登录，请重试',
                  showCancel: false
                })
                return;
              }
              if(res.data.code==0){
                wx.request({
                  url: 'https://api.it120.cc/lujun/user/wxinfo',
                  data:{
                    token: res.data.data.token
                  },
                  success:function(res){
                    console.log(res)
                    that.globalData.openid = res.data.data.openid;
                  }
                })
                that.globalData.token = res.data.data.token;
                that.globalData.uid = res.data.data.uid;
              }  
            }
          })
      }
    });
  },
  //注册
  register:function(){
    var that=this;
    wx.login({
      success: function (res) {
        var code=res.code;
        wx.getUserInfo({
          success:function(res){
            // var encryptedData = res.encryptedData;
            // var iv = res.iv;
            // wx.request({
            //   url: 'https://api.it120.cc/lujun/user/wxapp/register/complex',
            //   data: {
            //     code: code, 
            //     encryptedData: encryptedData, 
            //     iv: iv
            //   },
            //   header: {
            //     'content-type': 'application/json'
            //   },
            //   success: function (res) {
            //     that.login();
            //   }
            // })
          }
        })
          //发起网络请求  
      }
    });
  },
  // getUserInfo: function (cb) {
  //   var that = this
  //   if (this.globalData.userInfo) {
  //     typeof cb == "function" && cb(this.globalData.userInfo)
  //   } else {
  //     //调用登陆接口
  //     wx.login({
  //       success: function () {
  //         wx.getUserInfo({
  //           success: function (res) {
  //             that.globalData.userInfo = res.userInfo
  //             typeof cb == "function" && cb(that.globalData.userInfo)
  //           }
  //         })
  //       }
  //     })
  //   }
  // },
  sendTempleMsg: function (orderId, trigger, template_id, form_id, page, postJsonString) {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/lujun/template-msg/put',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: that.globalData.token,
        type: 0,
        module: 'order',
        business_id: orderId,
        trigger: trigger,
        template_id: template_id,
        form_id: form_id,
        url: page,
        postJsonString: postJsonString
      },
      success: (res) => {
       console.log(res)
      }
    })
  },
  sendTempleMsgImmediately: function (template_id, form_id, page, postJsonString) {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/lujun/template-msg/put',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: that.globalData.token,
        type: 0,
        module: 'immediately',
        template_id: template_id,
        form_id: form_id,
        url: page,
        postJsonString: postJsonString
      },
      success: (res) => {
      console.log(res)
      }
    })
  },
  globalData: {
    userInfo: null,
    subDomain: "lujun", // 如果你的域名是： https://api.it120.cc/abcd 那么这里只要填写 abcd
    version: "2.0",
  }
})