//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
      env:'cloud1-2gvx3fhmd22e1c0d',
        // env: 'prod-cxi-6gkb5tc6a5d69359',
        traceUser: true,
      })
    }

    //全局对象(小程序实例全局属性)
    this.globalData = {
      //开始日期
      startDate: '2020-01-01',
      isLogin: false,
      nickName: '',
      userImg: ''
    }

    if (!this.globalData.isLogin) {
      //获取用户登录数据
      wx.showLoading({
        title: '加载中...'
      })
      //小程序调用云函数是调用云端的云函数, 并不是本地的云函数
      wx.cloud.callFunction({
        //云函数名称
        name: 'get_user'
      }).then(res => {
        

        wx.hideLoading();

        if (res.result.data.length === 1) {
          this.globalData.isLogin = true;
          this.globalData.nickName = res.result.data[0].nickName;
          this.globalData.userImg = res.result.data[0].avatarUrl;
        }

      }).catch(err => {
        wx.hideLoading();
        
      })
    }


  }
})