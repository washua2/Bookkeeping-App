// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

let db = cloud.database();

//获取数据库查询指令引用
let _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  // 

  //按照记账日期范围查询用户记账数据
  //日期范围 date >= startDate 并且 date <= endDate
  //查询指令使用
  //https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database/query.html
  return await db.collection('booking').where({
    date: _.gte(event.startDate).and(_.lte(event.endDate)),
    userInfo: event.userInfo
  }).get()

}