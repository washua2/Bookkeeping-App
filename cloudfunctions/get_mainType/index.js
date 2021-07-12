// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

//获取数据库引用
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  // 
  //查询主要类型数据(餐饮、出行...)
  return await db.collection('mainType').get();
}