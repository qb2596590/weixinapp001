const app = getApp();
const db = wx.cloud.database();
const _ = db.command;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userid: '',
        pwd: '',
        user_tips: '',
        icon: '',
        pwd_tips: '',
        checked: false,
        nbFrontColor: '#ffffff',
        nbBackgroundColor: '#2d9ffe',
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onSwitch(event) {
        console.log(event.detail);
        this.setData({
            checked: event.detail,
        });
        wx.setStorageSync('SaveID&PWD', event.detail)
    },
    onLoad: function (options) {
        // let userInfo = wx.getStorageSync('userInfo')
        if (wx.getStorageSync('SaveID&PWD')) {
            this.setData({
                checked:wx.getStorageSync('SaveID&PWD'),
                userid:wx.getStorageSync('userid').id,
                pwd:wx.getStorageSync('userid').pwd
            })
        }else{
            this.setData({
                userid:'',
                pwd:''
            })
        }
    },

    verify_userid(e) {
        console.error(e);
        if (e.detail.cursor == 0) {
            this.setData({
                user_tips: '用户名不能为空'
            })
        } else {
            db.collection('user_id').where({
                userID: e.detail.value
            }).count().then(res => {
                if (res.total == 0) {
                    this.setData({
                        user_tips: '用户名错误'
                    })
                } else if (res.total > 0) {
                    this.setData({
                        icon: 'success',
                        user_tips: ''
                    })
                }
            })
        }
    },
    verify_pwd(e) {
        console.error(e);
        if (e.detail.cursor == 0) {
            this.setData({
                pwd_tips: '密码不能为空'
            })
        } else {
            db.collection('user_id').where({
                pwd: e.detail.value
            }).count().then(res => {
                console.log(res);
                if (res.total == 0) {
                    this.setData({
                        pwd_tips: '密码错误'
                    })
                } else if (res.total > 0) {
                    this.setData({
                        pwd_tips: ''
                    })
                }
            })
        }
    },

    toLogin() {
        let userID={};
        db.collection('user_id').where({
            userID:this.data.userid,
            pwd:this.data.pwd
        }).count().then(res=>{
            if (res.total>=1) {
                userID.id=this.data.userid;
                userID.pwd=this.data.pwd;
                console.log(userID);
                wx.setStorageSync('userid', userID)
                wx.redirectTo({
                    url: '/pages/index/index',
                  })
                  
            }else{
                userID.id='';
                userID.pwd='';
                console.log(userID);
                wx.setStorageSync('userid', userID)
                wx.showToast({
                  title: '用户名或密码错误',
                  icon:'error'
                })


            }
        })
        

    },
    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function () {},
})