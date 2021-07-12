let utils = require('../../js/utils');

//获取小程序实例
let app = getApp();

//注册页面
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //加载中, 显示骨架屏
    loading: true,

    //收入-支出
    typeData: [
      {title: '收入', type: 'sr'},
      {title: '支出', type: 'zc'}
    ],

    //激活收入-支出
    activeIndex: 0,

    //账户选择
    accountData: [
      {
        title: '现金',
        type: 'xj'
      },
      {
        title: '支付宝',
        type: 'zfb'
      },
      {
        title: '微信',
        type: 'wx'
      },
      {
        title: '储蓄卡',
        type: 'cxk'
      },
      {
        title: '信用卡',
        type: 'xyk'
      }
    ],

    //激活账户
    activeAccountIndex: -1,

    //保存所有主类型数据
    allMainTypeData: [],

    //每页显示主要类型个数
    count: 8,

    //当前选择的页面
    pageCode: -1,

    //选择日期的开始日期
    startDate: '',

    //选择日期的结束日期
    endDate: '',

    //用户选择的日期
    date: '选择日期',

    //金额
    money: '',

    //备注
    comment: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let currentDate = new Date();
    
    //格式化日期
    this.setData({
      startDate: app.globalData.startDate,
      endDate: utils.formatDate(currentDate, 'yyyy-MM-dd')
    })

    

    this.getMainTypeData();
  },

  //切换状态
  toggle(e) {
    let index = e.currentTarget.dataset.index;
    let key = e.currentTarget.dataset.key;

    if (this.data[key] === index) {
      
      return;
    }

    this.setData({
      [key]: index
    })
  },

  //查询主要类型数据(餐饮、出行....)
  getMainTypeData() {
    wx.showLoading({
      title: '加载中...'
    })
    //小程序调用云函数是调用云端的云函数, 并不是本地的云函数
    wx.cloud.callFunction({
      //云函数名称
      name: 'get_mainType'
    }).then(res => {
      

      wx.hideLoading();

      //去除骨架屏
      this.setData({
        loading: false
      })

      //分页处理
      // [
      //   {
      //     //当前页面的激活类型下标
      //     pageIndex: -1,
      //     types: [
      //       {}
      //     ]
      //   }
      // ]
      for (let i = 0; i < res.result.data.length; i += this.data.count) {
        let currentType = {
          pageIndex: -1,
          types: res.result.data.slice(i, i + this.data.count)
        };

        this.data.allMainTypeData.push(currentType);
      }

      this.setData({
        allMainTypeData: this.data.allMainTypeData
      })

      

      
    }).catch(err => {
      
    })
  },

  //切换主类型(餐饮、出行....)
  toggleMainType(e) {
    let index = e.currentTarget.dataset.index;
    let page = e.currentTarget.dataset.page;
    

    //如果点击同页同一个, 拦截
    if (this.data.allMainTypeData[page].pageIndex === index) {
      
      return;
    }

    //去除之前
    for (let i = 0; i < this.data.allMainTypeData.length; i++) {
      if (this.data.allMainTypeData[i].pageIndex > -1) {
        this.data.allMainTypeData[i].pageIndex = -1;
        break;
      }
    }

    //激活当前
    this.data.allMainTypeData[page].pageIndex = index;

    //页码激活
    this.data.pageCode = page;

    this.setData({
      allMainTypeData: this.data.allMainTypeData
    })
    
  },

  //更新表单控件的值
  updateValue(e) {
    
    //获取修改的属性
    let key = e.currentTarget.dataset.key;
    this.setData({
      [key]: e.detail.value
    })
  },

  //记一笔
  save() {

    //判断用户是否登录
    //如果没有登录
    if (!app.globalData.isLogin) {
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
              app.globalData.isLogin = true;
              app.globalData.nickName = res.userInfo.nickName;
              app.globalData.userImg = res.userInfo.avatarUrl;
            }
  
          }).catch(err => {
            wx.hideLoading();
            
          })
        }
      })
      
      return;
    }

    //判断是否选择主类型
    if (this.data.pageCode === -1) {
      wx.showToast({
        title: '请选择主类型',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    //判断是否选择账户
    if (this.data.activeAccountIndex === -1) {
      wx.showToast({
        title: '请选择账户',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    //判断是否填写日期
    if (this.data.date === '选择日期') {
      wx.showToast({
        title: '请选择日期',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    //判断是否输入金额
    if (this.data.money == 0 || this.data.money === '') {
      wx.showToast({
        title: '请填写有效金额',
        icon: 'none',
        duration: 2000
      })
      return;
    }


    //获取收入-支出数据
    let typeData = this.data.typeData[this.data.activeIndex];
    

    //获取主类型数据
    let data = this.data.allMainTypeData[this.data.pageCode];
    let mainTypeData = data.types[data.pageIndex];
    

    //获取账户数据
    let accountData = this.data.accountData[this.data.activeAccountIndex];
    

    //获取日期
    let date = this.data.date;
    

    //获取金额
    let money = this.data.money;
    

    //备注
    let comment = this.data.comment;
    

    //启动加载提示
    wx.showLoading({
      title: '加载中...'
    })

    //将数据保存到云端数据库
    wx.cloud.callFunction({
      name: 'add_booking',
      data: {
        typeData,
        mainTypeData,
        accountData,
        date,
        money,
        comment
      }
    }).then(res => {
      
      //关闭加载提示
      wx.hideLoading();

      //清除数据
      this.data.allMainTypeData[this.data.pageCode].pageIndex = -1;
      this.setData({
        allMainTypeData: this.data.allMainTypeData,
        pageCode: -1,
        activeAccountIndex: -1,
        date: '选择日期',
        money: '',
        comment: ''
      })
    }).catch(err => {
      
    })

  }

})