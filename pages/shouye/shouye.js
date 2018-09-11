// pages/shouye/shouye.js
var app=getApp();
Page({
  data: {
    banner:'',
    nav:'',
    notice:'',
    cards:'',
    length:'',
    goods:'',
    ispull:true,
    indexid:0,
    searchInput:'',
    scrollTop:0
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onLoad()
  },
  onLoad: function (options) {
    var that=this;
    //获取轮播图
    wx.request({
      url: 'https://api.it120.cc/lujun/banner/list',
      success: function (res) {
      that.setData({
        banner:res.data.data
      })
      }
    }),
    //获取导航
      wx.request({
      url: 'https://api.it120.cc/lujun/shop/goods/category/all',
        success: function (res) {
          that.setData({
            nav: res.data.data
          })
        }
      }),
      //获取公告
      wx.request({
      url: 'https://api.it120.cc/lujun/notice/list',
        success: function (res) {
          that.setData({
            notice: res.data.data.dataList[0].title
          })
        }
      }),
      //获取优惠卡
      wx.request({
      url: 'https://api.it120.cc/lujun/discounts/coupons',
      data: {
        type: ''
      },
        success: function (res) {
          that.setData({
            cards: res.data.data
          })
        }
      }),
    //获取商品
    wx.request({
      url: 'https://api.it120.cc/lujun//shop/goods/list',
      success: function (res) {
        that.setData({
          goods: res.data.data
        })
      }
    })
  } ,
  discounts:function(e){
    wx.request({
      url: 'https://api.it120.cc/lujun/discounts/fetch',
      data: {
        id:e.currentTarget.dataset.id,
        token: app.globalData.token
      },
      success:function(res){
        console.log(res)
        if(res.data.code==0){
          wx.showToast({
            title: '领取成功',
            icon:'success',
            duration:2000
          })
        }else if (res.data.code == 20001 || res.data.code == 20002) {
          wx.showToast({
            title: '您来晚了',
            icon: 'fail',
            duration: 2000
        })
      }else if (res.data.code == 20003) {
          wx.showToast({
            title: '您已经领过了',
            icon: 'fail',
            duration: 2000
          })
        }
        else{
          wx.showToast({
            title: res.data.msg,
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
  },
  //跳转详情页
  ongoodsDetail:function(event){
    var goodsId = event.currentTarget.dataset.goodsid;
    if (goodsId!=0){
      wx.navigateTo({
        url: '../good_detail/good_detail?id=' + goodsId,
      })
    } 
  },
  onPageScroll: function (e) {
    // Do something when page scroll
    var scrollTop=e.scrollTop
    this.setData({
      scrollTop: scrollTop
    })
  },
  scroll: function (e) {
     var that = this.scrollTop = that.data.scrollTop;
     wx.showToast({
       title: '加入购物车成功',
       icon: 'success',
       duration: 2000
     })
     that.setData({
       scrollTop: e.detail.scrollTop
     })
  },
  onnavTap:function(e){
    var indexid=e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var that=this;
    this.setData({
      indexid:indexid
    })
    wx.request({
      url: 'https://api.it120.cc/lujun//shop/goods/list',
      data:{
        categoryId:id
      },
      success:function(res){
        that.setData({
          goods: res.data.data
        })
      }
    })
  },
  listenerSearchInput: function (e) {
    this.setData({
      searchInput: e.detail.value
    })
},
  toSearch:function(e){
    var that=this;
    wx.request({
      url: 'https://api.it120.cc/lujun//shop/goods/list',
      data: {
        nameLike: this.data.searchInput
      },
      success: function (res) {
        that.setData({
          goods: res.data.data
        })
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '商城',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})