var nowDate = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    buyInfo: '',
    totalPrice: '',
    isadd: true,
    access_token: ''
  },

  onLoad: function (options) {
    console.log()
  },

  onReady: function () {

  },

  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'buyInfo',
      success: function (res) {
        that.setData({
          buyInfo: res.data
        })
      },
    })
    wx.getStorage({
      key: 'totalPrice',
      success: function (res) {
        that.setData({
          totalPrice: res.data
        })
      },
    })
    wx.request({
      url: 'https://api.it120.cc/lujun/user/shipping-address/default',
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          that.setData({
            isadd: false,
            address_name: res.data.data.linkMan,
            address_tel: res.data.data.mobile,
            address_provinceStr: res.data.data.provinceStr,
            address_cityStr: res.data.data.cityStr,
            address_areaStr: res.data.data.areaStr,
            address_detail: res.data.data.address,
            provinceId: res.data.data.provinceId,
            cityId: res.data.data.cityId,
            districtId: res.data.data.districtId,
            code: res.data.data.code
          })
        }
      }
    })
   
    this.more()
  },
  address: function () {
    wx.navigateTo({
      url: '../add_address/add_address',
    })
  },
  select_address: function () {
    wx.navigateTo({
      url: '../address_list/address_list',
    })
  },
  //1532486603720
  //1532486647781
  //1532486742685
  //1532486783849
  pay: function (e) {
    var form_id = e.detail.formId;
    console.log(form_id)
    var orderId=''
    var m_price=''
    var name_tem={}
    var name_arr=[]
    var m_name=''
    wx.showLoading({
      title: '提交订单中...',
    })
    for(var i=0;i<this.data.buyInfo.length;i++){
      name_arr.push(this.data.buyInfo[i].name)
      
    }
    console.log(name_arr)
    for (var i = 0; i < name_arr.length;i++){
      m_name += name_arr[i]+'/'
    }
    console.log(m_name)
    var that = this;
    var loginToken = wx.getStorageSync('token') // 用户登录 token
    var remark = ""; // 备注信息
    if (e.detail.value.remark) {
      remark = e.detail.value.remark
    } else {
      remark = '包邮'
    }
    var amountReal = 0
    var postData = {
      token: loginToken,
      goodsJsonStr: this.data.goodsJsonStr,
      remark: remark,
      amountReal: 50
    };
    postData.provinceId = this.data.provinceId;
    postData.cityId = this.data.cityId;
    postData.districtId = this.data.districtId;
    postData.address = this.data.address_detail;
    postData.linkMan = this.data.address_name;
    postData.mobile = this.data.address_tel;
    postData.code = this.data.code;
    postData.isNeedLogistics = 'true';
    wx.request({
      url: 'https://api.it120.cc/lujun/order/create',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: postData, // 设置请求的参数
      success: (res) => {
        orderId = res.data.data.orderNumber
        m_price = res.data.data.amountReal
        console.log(res)
        wx.hideLoading();
        if (res.data.code != 0) {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
          return;
        } else if (res.data.code == 0) {
          var token = app.globalData.access_token
          var openid = app.globalData.openid
          wx.request({
            url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + token,
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            data: {
              "touser": openid,
              "template_id": "xyd6SU61-ywjGqtXJmmzgsh6dcg3kKgmBSp2Ynqd8-I",
              "page": "pages/my_order/my_order",
              "form_id": form_id,
              data: {
                "keyword1": {
                  "value": orderId
                },
                "keyword2": {
                  "value": nowDate.formatTime(new Date)
                },
                "keyword3": {
                  "value": m_price
                },
                "keyword4": {
                  "value": m_name
                }
              }
            },
            success:function(res){
              console.log(res)
            }
          })
          //删除购物车购买的商品
          var cartInfo = wx.getStorageSync('cartInfo');
          var new_cartInfo = []
          for (var i = 0; i < that.data.buyInfo.length; i++) {
            if (that.data.buyInfo.length == 1) {
              wx.removeStorageSync('cartInfo')
            } else {
              new_cartInfo = cartInfo.splice(that.data.buyInfo[i].oid, 1)
            }
          }
          wx.setStorage({
            key: 'cartInfo',
            data: new_cartInfo,
          })
          // var postJsonString = {};
          // postJsonString.keyword1 = { value: res.data.data.orderNumber, color: '#173177' }
          // postJsonString.keyword2 = { value: res.data.data.amountReal + '元', color: '#173177' }
          // postJsonString.keyword3 = { value: res.data.data.dateAdd, color: '#173177' }
          // // orderId, trigger, template_id, form_id, page, postJsonString
          // app.sendTempleMsg(res.data.data.id, -1, 'xyd6SU61-ywjGqtXJmmzghe3wVA6Wr55Lvg7jyx0NgU', e.detail.formId,
          //   'pages/my_order/my_order', JSON.stringify(postJsonString));
          // 下单成功，跳转到订单管理界面
          wx.redirectTo({
            url: "/pages/my_order/my_order"
          });
        }
      }
    })
  },
  //获取商品详情
  more: function () {
    var goodsJsonStr = "[";
    var isNeedLogistics = 0;
    var buyInfo = wx.getStorageSync('buyInfo');
    for (let i = 0; i < buyInfo.length; i++) {
      let carShopBean = buyInfo[i];
      let Price = carShopBean.price;
      if (carShopBean.logistics) {
        isNeedLogistics = 1;
      }
      var goodsJsonStrTmp = '';
      if (i > 0) {
        goodsJsonStrTmp = ",";
      }
      let inviter_id = 0;
      goodsJsonStrTmp += '{"goodsId":' + carShopBean.goodsid + ',"number":' + carShopBean.selectNum + ',"propertyChildIds":"' + carShopBean.propertyChildIds + '","logisticsType":0,"amountReal":89}';
      goodsJsonStr += goodsJsonStrTmp;
    }
    goodsJsonStr += "]";
    this.setData({
      goodsJsonStr: goodsJsonStr
    })
  },
})