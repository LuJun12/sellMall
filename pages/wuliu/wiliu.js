// pages/wuliu/wiliu.js
Page({
  data: {
    logistics:''
  },

  onLoad: function (options) {
    var that=this;
    var company_code='';
    var trackingNumber='';
    console.log(options)
    var id = options.id
    wx.request({
      url: 'https://api.it120.cc/lujun/order/detail',
      data: {
        token: wx.getStorageSync('token'),
        id: id
      },
      success: function (res) {
        var logistics = res.data.data.logistics
        that.setData({
          logistics: logistics
        })
        // 申通 =”shentong” EMS =”ems” 顺丰 =”shunfeng” 圆通 =”yuantong” 中通 =”zhongtong” 韵达 =”yunda” 天天 =”tiantian” 汇通 =”huitongkuaidi” 全峰 =”quanfengkuaidi” 德邦 =”debangwuliu” 宅急送 =”zhaijisong”
        if (logistics.shipperName == '圆通速递') {
          company_code = 'yuantong'
        } else if (logistics.shipperName == 'EMS') {
          company_code = 'ems'
        }
        trackingNumber = logistics.trackingNumber
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
          url: 'https://www.kuaidi100.com/query',
          data: {
            'type': company_code,
            'postid': trackingNumber
          },
          success: function (res) {
            console.log(res)
            wx.hideLoading()
            that.setData({
              m_logistics: res.data.data
            })
          }
        })
      }
    })
  },
  onShow: function (options) {  
  },
})