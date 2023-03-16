// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: "cloud1-0gsag3x37e55ad72",
        traceUser: true,
      });
    }

    this.globalData = {};
    const db = wx.cloud.database();
    let isUser = false;
    wx.cloud.callFunction({ //查询openid是否为注册用户
      name: 'getuser'
    }).then(res => {
      let userInfo = wx.getStorageSync('userInfo')
      if (res.result.data.length > 0) { //判断数据库有无用户数据
        isUser = true;
        wx.setStorageSync('isUser', isUser);
        wx.setStorageSync('userInfo', res.result.data[0]); //有数据时,从云端返回用户数据存入本地缓存
        wx.cloud.callFunction({ //更新数据库用户数据
          name: 'save_updata',
          data: {
            avatarUrl: userInfo.avatarUrl,
            nickName: userInfo.nickName,
            count: 0,
            date: Number(new Date())
          }
        }).then()
      } else {
        isUser = false
        wx.setStorageSync('isUser', isUser)
      }
    })
    db.collection('index_catalog').get().then(res => {
        console.log(res.data);
        wx.setStorageSync('mulu1', res.data[0].json)
        wx.setStorageSync('mulu2', res.data[1].json)
        wx.setStorageSync('mulu3', res.data[2].json)
      })
  }
});