// pages/assess/assess.js
Page({
  data: {
    items: [
      { name: '1', value: '差评' },
      { name: '2', value: '中评' },
      { name: '3', value: '好评', checked: 'true'},
    ]
  },
  onLoad: function (options) {
    console.log(options)
    var that=this;
    var id = options.orderId;
    this.setData({
      id:id
    })
    wx.request({
      url: 'https://api.it120.cc/lujun/order/detail',
      data:{
        token:wx.getStorageSync('token'),
        id:id
      },
      success:function(res){
        that.setData({
          goods:res.data.data.goods,
          logistics:res.data.data.logistics,
          logs:res.data.data.logs,
          orderInfo:res.data.data.orderInfo
        })
      }
    })
  },
  onShow: function () {
  
  },
  send:function(e){
    console.log(e)
    var postJsonString={};
    var reputations=[];
    postJsonString.token=wx.getStorageSync('token');
    postJsonString.orderId =this.data.id;
    for(var i=0;i<this.data.goods.length;i++){
      var tem = {
        id: this.data.goods[i].id,
        reputation:e.detail.value['goodReputation'+i],
        remark: e.detail.value['goodReputationRemark'+i],
      }
      reputations.push(tem)
    }
    postJsonString.reputations = reputations;
    console.log(postJsonString)
    wx.request({
      url: 'https://api.it120.cc/lujun/order/reputation',
      data: {
            postJsonString
        },
      success:function(res){
        if(res.data.code==0){
          wx.showToast({
            title: '提交成功',
            success: function () {
              wx.navigateTo({
                url: '../my_order/my_order?indexid='+4,
              })
            }
          })
        }else{
              wx.showModal({
                title: '错误',
                content: res.data.msg,
              })
        }
      }
    })
  }
})