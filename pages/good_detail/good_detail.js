// pages/good_detail/good_detail.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    goodDetail: '',
    reputation: '',
    isShow: false,
    sizeList: '',
    colorList: '',
    num: 1,
    indexid: -1,
    indexid1: -1,
    selectSize: '',
    selectColor: '',
    selectNum: '',
    cartInfo: [],
    show_num: 0,
    cartInfo: ''
  },
  onLoad: function (option) {
    var goodsid = option.id;
    var that = this
    wx.getStorage({
      key: 'cartInfo',
      success: function (res) {
        that.data.cartInfo = res.data
      },
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://api.it120.cc/lujun/shop/goods/detail',
      data: {
        id: goodsid
      },
      success: function (res) {
        console.log(res)
        if (res.data.data.properties) {
          var colorList = res.data.data.properties[0];
          var sizeList = res.data.data.properties[1];
          var colourList = res.data.data.properties[2];
          that.setData({
            colorList: colorList,
            sizeList: sizeList,
            colourList: colourList
          })
        }
        that.setData({
          goodDetail: res.data.data
        })
        WxParse.wxParse('article', 'html', res.data.data.content, that, 5);
        wx.hideLoading()
      }
    }),
      this.reputation(goodsid)
  },
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'cartInfo',
      success: function (res) {
        that.setData({
          show_num: res.data.length
        })
      },
    })
  },
  //获取评论
  reputation: function (goodsId) {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/lujun/shop/goods/reputation',
      data: {
        goodsId: goodsId
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            reputation: res.data.data
          });
        }
      }
    })
  },
  //尺码框弹出
  selectSize: function (event) {
    this.setData({
      isShow: true
    })
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  //尺码框消失
  closeSize: function () {
    this.setData({
      isShow: false
    })
  },
  //加1
  addnum: function (e) {
    var size = e.currentTarget.dataset.num
    this.setData({
      num: this.data.num + 1
    })
  },
  //减1
  delnum: function (e) {
    var size = e.currentTarget.dataset.num
    if (this.data.num > 1) {
      this.setData({
        num: this.data.num - 1
      })
    } else {
      wx.showModal({
        title: '失败',
        content: '不能再减啦',
      })
    }
  },
  //选择颜色
  oncolorTap: function (e) {
    var indexid1 = e.currentTarget.dataset.index;
    var color = e.currentTarget.dataset.color;
    var colorid = e.currentTarget.dataset.colorid;
    var colorType = colorid + ':' + this.data.goodDetail.properties[0].childsCurGoods[indexid1].id
    this.setData({
      indexid1: indexid1,
      selectColor: color,
      colorType: colorType
    })
  },
  //选择尺码
  onsizeTap: function (e) {
    var size = e.currentTarget.dataset.size
    var indexid = e.currentTarget.dataset.index;
    var sizeid = e.currentTarget.dataset.sizeid;
    console.log(indexid)
    console.log(sizeid)
    var sizeType = sizeid + ':' + this.data.goodDetail.properties[1].childsCurGoods[indexid].id
    this.setData({
      indexid: indexid,
      selectSize: size,
      sizeType: sizeType
    })
  },

  //选择花色
  oncolourTap: function (e) {
    var indexid2 = e.currentTarget.dataset.index;
    var colour = e.currentTarget.dataset.colour;
    var colourid = e.currentTarget.dataset.colourid;
    var colourType = colourid + ':' + this.data.goodDetail.properties[2].childsCurGoods[indexid2].id
    this.setData({
      indexid2: indexid2,
      selectColour: colour,
      colourType: colourType
    })
  },
  //去购物车
  gocart: function () {
    wx.switchTab({
      url: '../shopping_cart/shopping_cart',
    })
  },
  addcart: function () {
    var cartInfo = this.data.cartInfo;
    var that = this;
    var colourType = null;
    var sizeType = null;
    var colorType = null;
    if (this.data.sizeList){
      if (this.data.selectSize) {
        var selectSize = this.data.selectSize;
        sizeType = this.data.sizeType;
      } else {
        wx.showToast({
          title: '请选择尺码',
        })
        return
      }
    }
    if (this.data.colorList){
      if (this.data.selectColor) {
        var selectColor = this.data.selectColor;
        colorType = this.data.colorType;
      } else {
        wx.showToast({
          title: '请选择颜色',
        })
        return
      }
    }
    if (this.data.colourList){
      if (this.data.selectColour) {
        var selectColour = this.data.selectColour;
        colourType = this.data.colourType;
      } else {
        wx.showToast({
          title: '请选择花色',
        })
        return
      }
    }
    var propertyChildIds = colorType + "," + sizeType + ',' + colourType
    if (!cartInfo) {
      cartInfo = [];
    }
    var tem = {
      selectSize: selectSize,
      selectColor: selectColor,
      selectColour: selectColour,
      selectNum: this.data.num,
      imgUrl: this.data.goodDetail.basicInfo.pic,
      name: this.data.goodDetail.basicInfo.name,
      price: this.data.goodDetail.basicInfo.minPrice,
      goodsid: this.data.goodDetail.basicInfo.id,
      logisticsId: this.data.goodDetail.basicInfo.logisticsId,
      logistics: this.data.goodDetail.logistics,
      propertyChildIds: propertyChildIds,
      active: false,
      oid:0,
    }
    //是否有重复添加的商品
    var hasSameGoods = -1;
    for (var i = 0; i < cartInfo.length; i++) {
      if (tem.name == cartInfo[i].name && tem.selectColor == cartInfo[i].selectColor && tem.selectSize == cartInfo[i].selectSize && tem.selectColour == cartInfo[i].selectColour) {
        hasSameGoods = i;
        tem.selectNum = tem.selectNum + cartInfo[i].selectNum;
        break;
      }else{
        tem.oid++
      }
    }
    if (hasSameGoods > -1) {
      cartInfo.splice(hasSameGoods, 1, tem)
    } else {
      cartInfo.push(tem)
    }
    wx.setStorage({
      key: 'cartInfo',
      data: cartInfo,
    })
    this.setData({
      show_num: cartInfo.length
    })
    this.closeSize();
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      duration: 2000
    })
  }
})