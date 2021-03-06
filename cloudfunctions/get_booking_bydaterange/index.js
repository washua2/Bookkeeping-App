// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

let db = cloud.database();

let _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  // 
  // 

  let date = null;
  if (event.end) {
    date = _.gte(event.start).and(_.lte(event.end));
 } else {
   date = event.start;
 }

  return await db.collection('booking').where({
    date,
    userInfo: event.userInfo
  }).get();


  
}