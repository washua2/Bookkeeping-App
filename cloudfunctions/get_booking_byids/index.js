// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

let db = cloud.database();

let _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  //当一个字段有多个条件时, 比如 a = 1 或者 a =2 或者 a = 3, 并且当不确定有几个条件时, 可以使用in
  let ids = event.ids.split('-');

  return await db.collection('booking').where({
    _id: _.in(ids),
    userInfo: event.userInfo
  }).get();
}