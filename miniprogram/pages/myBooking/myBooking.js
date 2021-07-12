// miniprogram/pages/myBooking/myBooking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,

    //我的记账数据
    myBookingData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserBooking();
  },

  //获取用记账数据
  getUserBooking() {
    wx.showLoading({
      title: '加载中...'
    })
    //小程序调用云函数是调用云端的云函数, 并不是本地的云函数
    wx.cloud.callFunction({
      //云函数名称
      name: 'get_user_booking'
    }).then(res => {
      

      wx.hideLoading();

      res.result.data.forEach(v => {
        v.money = Number(v.money).toFixed(2);
      })

      this.setData({
        myBookingData: res.result.data
      })


    }).catch(err => {
      
    })
  },

  //删除记账
  removeBookingBy_id(e) {


    wx.showModal({
      title: '提示信息',
      content: '是否确认删除该记账数据？',
      success: res => {
        if (res.confirm) {
          


          // 
          //截取子组件发射的参数
          let _id = e.detail._id;
          

          wx.showLoading({
            title: '加载中...'
          })
          //小程序调用云函数是调用云端的云函数, 并不是本地的云函数
          wx.cloud.callFunction({
            //云函数名称
            name: 'remove_booking_by_id',

            //参数
            data: {
              _id
            }
          }).then(res => {
            

            wx.hideLoading();

            if (res.result.stats.removed === 1) {
              //成功删除数据库数据
              //删除页面的数据
              for (let i = 0; i < this.data.myBookingData.length; i++) {
                if (this.data.myBookingData[i]._id === _id) {
                  this.data.myBookingData.splice(i, 1);
                  break;
                }
              }

              this.setData({
                myBookingData: this.data.myBookingData
              })

            }


          }).catch(err => {
            
          })


        }
      }
    })




  }
})