// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID
    let avatarUrl = event.avatarUrl;
    let nickName = event.nickName;
    let count = event.count;
    let date = event.date;
    var res = await db.collection("userAll").where({
        openid: openid
    }).count()
    if (res.total > 0) {
        return await db.collection('userAll').where({
            openid: openid
        }).update({
            data: {
                avatarUrl,
                nickName,
                count: _.inc(1),
                date,
                openid: openid
            }
        })
    } else {
        return await db.collection('userAll').add({
            data: {
                avatarUrl,
                nickName,
                count,
                date,
                openid: openid
            }
        })
    }
}