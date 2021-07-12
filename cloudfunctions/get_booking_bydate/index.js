// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

let db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  // 
  //event: 参数和用户openId, appId
  return await db.collection('booking').where(event).get();

}