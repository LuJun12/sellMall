// pages/my_order/my_order.js
var nowDate = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    statusType: ["待付款", "待发货", "待收货", "待评价", "已完成"],
    indexid: 0,
    hasorder: true,
    haspay: false,
    hassend: false,
    assess: false,
    dotClass: ['', '', '', '', ''],
    hasdot: false
  },
  onLoad: function (options) {
    if (options.indexid) {
      this.setData({
        indexid: options.indexid
      })
    }
  },
  onPullDownRefresh: function () {
    //  //在标题栏中显示加载
    wx.showNavigationBarLoading()
    this.onShow()
  },
  onShow: function () {
    wx.showNavigationBarLoading()
    wx.request({
      url: 'https://api.it120.cc/lujun/order/statistics',
      data: {
        token: wx.getStorageSync('token'),
      },
      success: function (res) {
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading()
        var dotClass = that.data.dotClass;
        if (res.data.code == 0) {
          wx.hideNavigationBarLoading()
          if (res.data.data.count_id_no_pay > 0) {
            dotClass[0] = 'dot'
          } else {
            dotClass[0] = ''
          }
          if (res.data.data.count_id_no_transfer > 0) {
            dotClass[1] = 'dot'
          } else {
            dotClass[1] = ''
          }
          if (res.data.data.count_id_no_confirm > 0) {
            dotClass[2] = 'dot'
          } else {
            dotClass[2] = ''
          }
          if (res.data.data.count_id_no_reputation > 0) {
            dotClass[3] = 'dot'
          } else {
            dotClass[3] = ''
          }
          if (res.data.data.count_id_no_pay > 0) {
            dotClass[4] = 'dot'
          } else {
            dotClass[4] = ''
          }
          that.setData({
            dotClass: dotClass
          })
        }
      }
    })
    if (this.data.indexid == 0) {
      this.setData({
        haspay: true,
        hassend: false,
        assess: false,
      })
    } else if (this.data.indexid == 2) {
      this.setData({
        haspay: false,
        hassend: true,
        assess: false,
      })
    } else if (this.data.indexid == 3) {
      this.setData({
        haspay: false,
        hassend: false,
        assess: true,
      })
    } else {
      this.setData({
        haspay: false,
        hassend: false,
        assess: false,
      })
    }
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var postData = {
      token: wx.getStorageSync('token')
    };
    postData.status = that.data.indexid;
    wx.request({
      url: 'https://api.it120.cc/lujun/order/list',
      data: postData,
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          that.setData({
            orderList: res.data.data.orderList,
            logisticsMap: res.data.data.logisticsMap,
            goodsMap: res.data.data.goodsMap,
            hasorder: false
          });
        } else {
          that.setData({
            orderList: null,
            logisticsMap: {},
            goodsMap: {},
            hasorder: true
          });
        }
      }
    })
  },
  select_nav: function (e) {
    var indexid = e.currentTarget.dataset.index
    this.setData({
      indexid: indexid
    })
    this.onShow()
  },
  cancelOrder: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '你确定要取消这个订单吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '操作中',
          })
          wx.request({
            url: 'https://api.it120.cc/lujun/order/close',
            data: {
              token: wx.getStorageSync('token'),
              orderId: orderId
            },
            success: function (res) {
              wx.hideLoading()
              wx.showToast({
                title: '订单取消成功',
              })
              that.onShow()
            }
          })
        }
      }
    })
  },
  pay: function (e) {
    var that = this;
    var index=e.currentTarget.dataset.index
    var orderId = e.currentTarget.dataset.id
    var formId = e.detail.formId
    var openid = app.globalData.openid
    var m_price = this.data.orderList[index].amountReal
    var m_name = ''
    for (var i = 0; i < this.data.goodsMap[orderId].length;i++){
      m_name += this.data.goodsMap[orderId][i].goodsName+'/'
    }
    wx.showModal({
      title: '提示',
      content: '确定付款吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://api.it120.cc/lujun/order/pay',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              token: wx.getStorageSync('token'),
              orderId: orderId
            },
            success: function (res) {
              var access_token = app.globalData.access_token
              if (res.data.code == 0) {
                that.setData({
                  indexid: 1
                })
                that.onShow()
                wx.showToast({
                  title: '付款成功',
                })
                wx.request({
                  url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + access_token,
                  method: 'POST',
                  header: {
                    'content-type': 'application/json'
                  },
                  data: {
                    "touser": openid,
                    "template_id": "v6Q3-OIy4LgFRSGvbWh43dPGHqSj8rhl2GcScMBIJp4",
                    "page": "pages/my_order/my_order",
                    "form_id": formId,
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
                  success: function (res) {
                  }
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '已取消付款',
          })
        }
      }
    })

  },
 
  //物流
  wuliu: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../wuliu/wiliu?id=' + id,
    })
  },
  //确认收货
  takeGoods: function (e) {
    var index = e.currentTarget.dataset.index
    var formId = e.detail.formId
    var openid = app.globalData.openid
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    var m_price = this.data.orderList[index].amountReal
    var m_name = ''
    for (var i = 0; i < this.data.goodsMap[orderId].length; i++) {
      m_name += this.data.goodsMap[orderId][i].goodsName + '/'
    }
   
    wx.showModal({
      title: '提示',
      content: '确定收货吗',
      success: function (res) {
        var access_token = app.globalData.access_token
        if (res.confirm) {
          wx.request({
            url: 'https://api.it120.cc/lujun/order/delivery',
            data: {
              token: wx.getStorageSync('token'),
              orderId: orderId
            },
            success: function (res) {
              that.setData({
                indexid: 3
              })
              that.onShow()
              wx.request({
                url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + access_token,
                method: 'POST',
                header: {
                  'content-type': 'application/json'
                },
                data: {
                  "touser": openid,
                  "template_id": "7cU95jQYsOrk0cuXIhGINRrpVuFyks7gsw3wW4QNkyE",
                  "page": "pages/my_order/my_order",
                  "form_id": formId,
                  data: {
                    "keyword1": {
                      "value": orderId
                    },
                    "keyword2": {
                      "value": m_name
                    },
                    "keyword3": {
                      "value": nowDate.formatTime(new Date)
                    },
                    "keyword4": {
                      "value": m_price
                    }
                  }
                },
                success: function (res) {
                  console.log(res)
                }
              })
            }
          })
        } else {
          wx.showToast({
            title: '已取消',
          })
        }
      }
    })
  },
  //评价商品
  assess: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../assess/assess?orderId=' + orderId,
    })
  }
})