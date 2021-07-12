// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

let db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  // 
  //将数据添加到数据库
  return await db.collection('booking').add({
    data: event
  });
}