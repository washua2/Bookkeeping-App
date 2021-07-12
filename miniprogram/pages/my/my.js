let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,

    //是否登录
    isLogin: false,

    userInfo: {
      nickName: '',
      userImg: ''
    }
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserLoginData();
  },

  //查看我的记账
  viewMyBooking() {
    wx.navigateTo({
      url: '../myBooking/myBooking'
    })
  },


  //获取用户信息
  getUserInfo() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: res => {
        
        //将用户数据保存在数据库
        wx.showLoading({
          title: '加载中...'
        })
        wx.cloud.callFunction({
          name: 'add_user',
          data: {
            user: res.userInfo
          }
        }).then(result => {
          wx.hideLoading();
          

          if (result.result._id) {
            //已经成功登录
            this.setData({
              isLogin: true,
              userInfo: {
                nickName: res.userInfo.nickName,
                userImg: res.userInfo.avatarUrl
              }
            })

            app.globalData.isLogin = true;
            app.globalData.nickName = res.userInfo.nickName;
            app.globalData.userImg = res.userInfo.avatarUrl;
          }

        }).catch(err => {
          wx.hideLoading();
          
        })
      }
    })
  },

  //获取用户登录数据
  getUserLoginData() {
    if (!app.globalData.isLogin) {
      wx.showLoading({
        title: '加载中...'
      })
      //小程序调用云函数是调用云端的云函数, 并不是本地的云函数
      wx.cloud.callFunction({
        //云函数名称
        name: 'get_user'
      }).then(res => {
        
        wx.hideLoading();
        //如果已经登录过
        if (res.result.data.length === 1) {
          app.globalData.isLogin = true;
          app.globalData.nickName = res.result.data[0].nickName;
          app.globalData.userImg = res.result.data[0].avatarUrl;
          this.setData({
            userInfo: {
              nickName: res.result.data[0].nickName,
              userImg: res.result.data[0].avatarUrl
            },
            isLogin: true
          })
        }

        this.setData({
          loading: false
        })
        
      }).catch(err => {
        wx.hideLoading();
        
      })
    } else {
      //如果已经登录
      this.setData({
        userInfo: {
          nickName: app.globalData.nickName,
          userImg: app.globalData.userImg
        },
        isLogin: app.globalData.isLogin
      })

      setTimeout(() => {
        this.setData({
          loading: false
        })
      }, 1000)
    }
    
  }

  
})