// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  var id = event.id;
  return await db.collection('workdata').doc(id).update({
    data: {
      count: _.inc(1)//下载数量自增+1
    }
  })
}
//获取文件自增云函数