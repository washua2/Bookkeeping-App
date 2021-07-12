
let utils = require('../../js/utils')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,

    startDate: '',
    endDate: '',

    // 当日的记账数据
    currentBooking: [],

    //几月几号
    date: '',

    //用户选择的日期
    selectDate: '',

    //当日记账数据
    currentDateMoney: {
      sr: 0,
      zc: 0
    },

    //本月记账数据
    monthBooking: {
      sr: {
        int: 0,
        decimal: '00'
      },
      zc: {
        int: 0,
        decimal: '00'
      },
      surplus: {
        int: 0,
        decimal: '00'
      }
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    //获取当前日期
    let currentDate = utils.formatDate(new Date(), 'yyyy-MM-dd');
    

    let startDate = currentDate.split('-').slice(0, 2);
    startDate.push('01');

    this.setData({
      startDate: startDate.join('-'),
      endDate: currentDate
    })

    
    

    this.getBookingByDate(currentDate);

    this.getCurrentMonthBooking();
  },

  //根据日期获取记账数据
  getBookingByDate(date) {
    wx.showLoading({
      title: '加载中...'
    })
    //小程序调用云函数是调用云端的云函数, 并不是本地的云函数
    wx.cloud.callFunction({
      //云函数名称
      name: 'get_booking_bydate',

      //参数
      data: {
        date
      }
    }).then(res => {
      

      wx.hideLoading();

      //统计当日的收入-支出的总金额
      this.data.currentDateMoney = {
        sr: 0,
        zc: 0
      }
      res.result.data.forEach(v => {
       
        this.data.currentDateMoney[v.typeData.type] += Number(v.money);

        v.money = Number(v.money).toFixed(2);
      })

      for (let key in this.data.currentDateMoney) {
        this.data.currentDateMoney[key] = this.data.currentDateMoney[key].toFixed(2);
      }

      let d = date.split('-');

      this.setData({
        currentBooking: res.result.data,
        date: `${d[1]}月${d[2]}日`,
        currentDateMoney: this.data.currentDateMoney,
        selectDate: date
      })

    }).catch(err => {
      
    })
  },

  //切换日期
  toggleDate(e) {
    let selectDate = e.detail.value;
    // 

    //判断用户是否选择相同的日期
    if (this.data.selectDate === selectDate) {
      
      return;
    }

    this.getBookingByDate(selectDate);
  },

  //查询本月的记账数据
  getCurrentMonthBooking() {
    
    wx.showLoading({
      title: '加载中...'
    })
    //小程序调用云函数是调用云端的云函数, 并不是本地的云函数
    wx.cloud.callFunction({
      //云函数名称
      name: 'get_booking_bymonth',

      //参数
      data: {
        startDate: this.data.startDate,
        endDate: this.data.endDate
      }
    }).then(res => {
      

      wx.hideLoading();

      //统计收入和支出
      let money = {
        sr: 0,
        zc: 0
      };

      res.result.data.forEach(v => {
        money[v.typeData.type] += Number(v.money);
      })

    
      //保留两位小数
      for (let key in money) {
        money[key] = money[key].toFixed(2);
      }

      //结余
      money.surplus = (Number(money.sr) - Number(money.zc)).toFixed(2);

      

      for (let key in money) {
        let m = money[key].split('.');
        this.data.monthBooking[key].int = m[0];
        this.data.monthBooking[key].decimal = m[1];
      }

      

      this.setData({
        monthBooking: this.data.monthBooking,
        loading: false
      })


    }).catch(err => {
      
    })
    
  }

})