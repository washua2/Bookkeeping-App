
let utils = require('../../js/utils')

let app = getApp();

import * as echarts from '../../components/ec-canvas/echarts'

let chartInstance = null;

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  

  //保存图形实例, 以便后续使用
  chartInstance = chart;
  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,

    ec: {
      onInit: initChart
    },

    //激活年月日下标
    activeDateTypeIndex: 0,

    //年月日
    //0: 年, 1: 月, 2: 日
    dateType: [
      {
        title: '年'
      },
      {
        title: '月'
      },
      {
        title: '日'
      }
    ],

    //选择日期
    userSelectDate: '',

    //开始日期
    startDate: '',

    //结束日期
    endDate: '',

    //选择的日期
    date: '选择日期',

    //激活收入-支出下标
    activeTypeDataIndex: 0,

    //收入-支出
    typeData: [
      {
        title: '收入',
        type: 'sr',
        money: '0.00'
      },
      {
        title: '支出',
        type: 'zc',
        money: '0.00'
      }
    ],

    //记账分类数据
    bookingResult: {}

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    let today = utils.formatDate(new Date(), 'yyyy-MM-dd');

    this.setData({
      startDate: app.globalData.startDate,
      endDate: today
    })

    // 
    // 

    //缓存今天日期
    this.data.userSelectDate = today;
    this.showDate(today);

    this.getUserBookingByDateRange();

  },

  //绘制拼图
  drawPie() {
    //获取绘制饼图的数据
    //保存当前绘制饼图的区域块颜色
    let color = [];
    let currentType = this.data.typeData[this.data.activeTypeDataIndex].type;
    let data = this.data.bookingResult[currentType];
    data.forEach(v => {
      color.push(v.color);
    })

    
    

    var option = {
      backgroundColor: "#ffffff",
      legend: {
        top: 'bottom'
      },
  
      //数据选项
      series: [{
        label: {
          normal: {
            fontSize: 14
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['0%', '60%'],
  
        //区域块的颜色
        color,
  
        //绘制饼图的数据
        data
      }]
    };
  
    //绘制图形
    chartInstance.setOption(option);
  },

  //切换标签状态
  toggleStatus(e) {
    let index = e.currentTarget.dataset.index;
    let key = e.currentTarget.dataset.key
    if (this.data[key] === index) {
      return;
    }

    this.setData({
      [key]: index
    })

    this.drawPie();
  },

  //切换年月日
  toggleDateType(e) {
    this.toggleStatus(e);

    this.showDate(this.data.userSelectDate);

    this.getUserBookingByDateRange();
  },

  //选择日期
  selectDate(e) {
    this.data.userSelectDate = e.detail.value;
    // 

    this.showDate(e.detail.value);

    this.getUserBookingByDateRange();
  },

  //处理显示日期
  showDate(date) {
    // 
    let currentDate = date.split('-');
    

    //按年查询
    if (this.data.activeDateTypeIndex === 0) {
      this.data.date = `${currentDate[0]}年`;
    } else if (this.data.activeDateTypeIndex === 1) {
      //按月查询
      this.data.date = `${currentDate[0]}年${currentDate[1]}月`;
    } else {
      //按日查询
      this.data.date = `${currentDate[0]}年${currentDate[1]}月${currentDate[2]}日`;
    }

    this.setData({
      date: this.data.date
    })
  },

  //切换收入-支出
  toggleType(e) {
    this.toggleStatus(e);
  },

  //根据日期范围获取用户记账数据
  getUserBookingByDateRange() {
    //开始日期
    let start = '';
    //结束日期
    let end = '';

    //用户选择的日期
    let date = this.data.userSelectDate.split('-');
    

    //获取当前日期
    let currentDate = utils.formatDate(new Date(), 'yyyy-MM-dd').split('-');
    

    // 按年查询
    // 如果是同年, 查询范围 当年-01-01 到 当年-当月-当日
    // 如果是不同年, 查询范围 当年-01-01 到 当年-12-31
    if (this.data.activeDateTypeIndex === 0) {
      start = `${date[0]}-01-01`;
      if (date[0] === currentDate[0]) {
        //如果同年
        end = date.join('-');
      } else {
        //如果不同年
        end = `${date[0]}-12-31`;
      }
    } else if (this.data.activeDateTypeIndex === 1) {
      start = `${date[0]}-${date[1]}-01`;
      //按月查询
      /**
       * 按月查询
          如果是同年
            如果是同月, 查询范围：当年-当月-01 到 当年-当月-当日
            如果不同月
              如果是2月份
                如果是闰年, 查询范围：当年-02-01 到 当年-02-29
                如果是平年, 查询范围：当年-02-01 到 当年-02-28
              如果不是2月份
                如果大月, 查询范围：当年-当月-01 到 当年-当月-31
                如果小月, 查询范围：当年-当月-01 到 当年-当月-30

          如果不同年
            如果是2月份
              如果是闰年, 查询范围：当年-02-01 到 当年-02-29
              如果是平年, 查询范围：当年-02-01 到 当年-02-28
            如果不是2月份
              如果大月, 查询范围：当年-当月-01 到 当年-当月-31
              如果小月, 查询范围：当年-当月-01 到 当年-当月-30
       */
      //如果同年
      if (date[0] === currentDate[0]) {
        //如果同月
        if (date[1] === currentDate[1]) {
          end = `${date[0]}-${date[1]}-${currentDate[2]}`;
        } else {
          //不同月
          end = utils.formatDate(new Date(date[0], date[1], 0), 'yyyy-MM-dd');
          // 
        }
      } else {
        //如果不同年
        end = utils.formatDate(new Date(date[0], date[1], 0), 'yyyy-MM-dd');
        // 
      }
    } else {
      //按日查询
      start = date.join('-');
    }



    
    

    let data = {
      start
    };

    if (end) {
      data.end = end;
    }

    wx.showLoading({
      title: '加载中...'
    })

    wx.cloud.callFunction({
      name: 'get_booking_bydaterange',
      data
    }).then(res => {
      wx.hideLoading();
      

      //清零收入-支出总金额
      this.data.typeData.forEach(v => {
        v.money = 0;
      })

      //按照收入-支出分类
      let type = {
        sr: [],
        zc: []
      };

      
      res.result.data.forEach(v => {
        type[v.typeData.type].push(v);
      })

      // [
      //   {
      //     title: '餐饮',
      //     count: 2,
      //     money: 200,
      //     icon: '',
      //     percent: '30%',
      //     data: [
      //       {},
      //       {}
      //     ]
      //   }
      // ]
      let bookingData = {};
      for (let key in type) {
        let o = {};
        //{canyin: {}, chuxing: {}}
        type[key].forEach(v => {
          //如果不存在该类型, 初始化
          if (!o[v.mainTypeData.type]) {
            o[v.mainTypeData.type] = {
              count: 1,
              type: v.mainTypeData.type,
              money: Number(v.money),
              icon: v.mainTypeData.icon,
              title: v.mainTypeData.title,
              color: utils.createColor(),
              ids: [v._id],
              key,
              data: [v],

              //绘制饼图的字段数据
              name: v.mainTypeData.title,
              value: Number(v.money)
            }
          } else {
            o[v.mainTypeData.type].count++;
            o[v.mainTypeData.type].money += Number(v.money);
            o[v.mainTypeData.type].data.push(v);
            o[v.mainTypeData.type].value += Number(v.money);
            o[v.mainTypeData.type].ids.push(v._id);
          }

          //统计收入-支出总金额
          for (let i = 0; i < this.data.typeData.length; i++) {
  
            if (this.data.typeData[i].type === key) {
              this.data.typeData[i].money = Number(this.data.typeData[i].money) + Number(v.money);
              break;
            }
          }
          
        })

        bookingData[key] = o;
      }

      //保留2位小数
      let bookingResult = {};
      for (let key in bookingData) {
        bookingResult[key] = [];
        for (let k in bookingData[key]) {
          bookingData[key][k].money = bookingData[key][k].money.toFixed(2);
          bookingResult[key].push(bookingData[key][k]);
        }
      }

      this.data.typeData.forEach(v => {
        v.money = v.money.toFixed(2);
      })

      //计算每个类型占比(餐饮, 出行...)
      this.data.typeData.forEach(item => {
        bookingResult[item.type].forEach(v => {
          v.ids = v.ids.join('-');
          v.percent = Number(v.money) / Number(item.money) * 100 + '%'
          v.name += ` ${(Number(v.money) / Number(item.money) * 100).toFixed(0)}%`
        })
      })



      this.setData({
        bookingResult,
        typeData: this.data.typeData,
        loading: false
      })

      // 

      //绘制饼图
      this.drawPie();
      

    }).catch(err => {
      
      wx.hideLoading();
      
    })
    
    

  },

  //查看记账详情
  viewBookingDetail(e) {
    
    let ids = e.currentTarget.dataset.ids;
    
    wx.navigateTo({
      url: `../detail/detail?ids=${ids}`
    })
  }

  
})