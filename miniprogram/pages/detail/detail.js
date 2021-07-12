// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    bookingData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //options: 保存跳转页面携带的参数
    

    this.getBookingByIds(options.ids);
  },

  //根据记账id查询数据
  getBookingByIds(ids) {
    wx.showLoading({
      title: '加载中...'
    })
    //小程序调用云函数是调用云端的云函数, 并不是本地的云函数
    wx.cloud.callFunction({
      //云函数名称
      name: 'get_booking_byids',
      data: {
        ids
      }
    }).then(res => {
      

      wx.hideLoading();

      res.result.data.forEach(v => {
        v.money = Number(v.money).toFixed(2);
      })

      this.setData({
        bookingData: res.result.data,
        loading: false
      })
      
    }).catch(err => {
      wx.hideLoading();
      
    })
  }

  
})