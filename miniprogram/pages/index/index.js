const db = wx.cloud.database();
const _ = db.command;
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    mulu_1List: {},
    mulu_2List: {},
    mulu_3List: {},
    nbFrontColor: '#ffffff',
    nbBackgroundColor: '#1682fe',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

      this.setData({
        mulu_1List: wx.getStorageSync('mulu1'),
        mulu_2List: wx.getStorageSync('mulu2'),
        mulu_3List: wx.getStorageSync('mulu3')
      })
      if ( !wx.getStorageSync('userid')) {
        Dialog.alert({
            title: '提示',
            message: '点击【确认】跳转至首页\n请使用账号密码登陆!',
        }).then(() => {
            // on close
            wx.redirectTo({
                url: '/pages/login/login',
            })
        });
    }
  },
  onClickGrid(e) {
    // if (wx.getStorageSync('isUser') ) { //调用全局数据,是否含有用户缓存
    console.log(e.currentTarget.dataset.name,e.currentTarget.dataset.type);
        wx.navigateTo({
            url: '/pages/equipment/equipment?name='+e.currentTarget.dataset.name+'&type='+e.currentTarget.dataset.type,
        })
    //   } else {
    //     wx.getUserProfile({
    //       desc: '获取用户信息',
    //       lang: 'zh_CN',
    //       success: res => {
    //         wx.cloud.callFunction({
    //           name: 'save_updata',
    //           data: {
    //             avatarUrl: res.userInfo.avatarUrl,
    //             nickName: res.userInfo.nickName,
    //             count: 0,
    //             date:Number(new Date())
    //           }
    //         }).then(() => {
    //           let isUser=true;
    //           wx.setStorageSync('isUser', isUser);
    //           wx.cloud.callFunction({
    //             name: 'getuser',
    //           }).then(e => {
    //             wx.setStorageSync('userInfo', e.result.data[0])
    //             app.globalData.userInfo = e.result.data[0] //赋值给全局变量userInfo
    //           })
    //         })
    //         wx.navigateTo({
    //             url: '/pages/equipment/equipment?name='+e.currentTarget.dataset.name+'&type='+e.currentTarget.dataset.type,
    //         })
    //       }
    //     })
    //   }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({
      active: event.detail
    });
    if (event.detail == 2) {
        // if (wx.getStorageSync('isUser') ) { //调用全局数据,是否含有用户缓存
            wx.redirectTo({
              url: '/pages/rules/rules',
            })
        //   } else {
        //     wx.getUserProfile({
        //       desc: '获取用户信息',
        //       lang: 'zh_CN',
        //       success: res => {
        //         wx.cloud.callFunction({
        //           name: 'save_updata',
        //           data: {
        //             avatarUrl: res.userInfo.avatarUrl,
        //             nickName: res.userInfo.nickName,
        //             count: 0,
        //             date:Number(new Date())
        //           }
        //         }).then(() => {
        //           let isUser=true;
        //           wx.setStorageSync('isUser', isUser);
        //           wx.cloud.callFunction({
        //             name: 'getuser',
        //           }).then(e => {
        //             wx.setStorageSync('userInfo', e.result.data[0])
        //             app.globalData.userInfo = e.result.data[0] //赋值给全局变量userInfo
        //           })
        //         })
        //         wx.redirectTo({
        //           url: '/pages/rules/rules',
        //         })
        //       }
        //     })
        //   }
        // ---------------
    } else if (event.detail == 1) {

        // if (wx.getStorageSync('isUser') ) { //调用全局数据,是否含有用户缓存
            wx.redirectTo({
              url: '/pages/station/station',
            })
        //   } else {
        //     wx.getUserProfile({
        //       desc: '获取用户信息',
        //       lang: 'zh_CN',
        //       success: res => {
        //         wx.cloud.callFunction({
        //           name: 'save_updata',
        //           data: {
        //             avatarUrl: res.userInfo.avatarUrl,
        //             nickName: res.userInfo.nickName,
        //             count: 0,
        //             date:Number(new Date())
        //           }
        //         }).then(() => {
        //           let isUser=true;
        //           wx.setStorageSync('isUser', isUser);
        //           wx.cloud.callFunction({
        //             name: 'getuser',
        //           }).then(e => {
        //             wx.setStorageSync('userInfo', e.result.data[0])
        //             app.globalData.userInfo = e.result.data[0] //赋值给全局变量userInfo
        //           })
        //         })
        //         wx.redirectTo({
        //           url: '/pages/station/station',
        //         })
        //       }
        //     })
        //   }
        // -------------
    }else if (event.detail == 3) {

        // if (wx.getStorageSync('isUser') ) { //调用全局数据,是否含有用户缓存
            wx.redirectTo({
              url: '/pages/handbook/handbook',
            })
        //   } else {
        //     wx.getUserProfile({
        //       desc: '获取用户信息',
        //       lang: 'zh_CN',
        //       success: res => {
        //         wx.cloud.callFunction({
        //           name: 'save_updata',
        //           data: {
        //             avatarUrl: res.userInfo.avatarUrl,
        //             nickName: res.userInfo.nickName,
        //             count: 0,
        //             date:Number(new Date())
        //           }
        //         }).then(() => {
        //           let isUser=true;
        //           wx.setStorageSync('isUser', isUser);
        //           wx.cloud.callFunction({
        //             name: 'getuser',
        //           }).then(e => {
        //             wx.setStorageSync('userInfo', e.result.data[0])
        //             app.globalData.userInfo = e.result.data[0] //赋值给全局变量userInfo
        //           })
        //         })
        //         wx.redirectTo({
        //           url: '/pages/handbook/handbook',
        //         })
        //       }
        //     })
        //   }
        // -------------
    }
  },

})