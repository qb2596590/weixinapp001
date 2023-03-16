const handbook = require("../../json/handbook")
const db = wx.cloud.database();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 3,
        bookList: {}
    },
    onChange(event) {
        // event.detail 的值为当前选中项的索引
        this.setData({
            active: event.detail
        });
        if (event.detail == 0) {
            wx.redirectTo({
                url: '/pages/index/index',
            })
        } else if (event.detail == 1) {
            wx.redirectTo({
                url: '/pages/station/station',
            })
        } else if (event.detail == 2) {
            wx.redirectTo({
                url: '/pages/rules/rules',
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
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
        console.log(handbook.handbook);
        let arr = handbook.handbook;
        this.setData({
            bookList: arr
        })
    },
    onClick(e){
        let file_name=e.currentTarget.dataset.name;
        console.log(file_name);
        db.collection('handbook').where({
            section_3:file_name
        }).get().then(ress=>{
            console.log(ress);
            const manage = wx.getFileSystemManager(); //本地持久
            if (!ress.data[0].handbook_file) {
                wx.showToast({
                    title: '资料待补充',
                    icon: 'error',
                    mask: true,
                    duration: 500
                })
                return
            }
            var fileName = e.currentTarget.dataset.name//定义文件名
            var str_type = '.pdf'; //通过https获取的地址截取文件类型
            let temp = wx.env.USER_DATA_PATH + "/" + fileName + str_type
            // console.log(temp)
            manage.access({ //判断本地文件是否存在
                path: temp,
                success(res) {
                    // 文件存在
                    wx.openDocument({
                        filePath: wx.env.USER_DATA_PATH + "/" + fileName + str_type, //打开
                        showMenu: true, //支持分享       
                    })
    
                },
                fail(res) {
                    const downloadTask = wx.downloadFile({ //监听下载
                        url: ress.data[0].handbook_file, //下载地址
                        success(res) { //成功回调
                            // console.log(res)
                            if (res.statusCode === 200) {
                                //将临时地址转存到本地缓存中（要点）
                                manage.saveFile({
                                    tempFilePath: res.tempFilePath, //临时地址
                                    filePath: wx.env.USER_DATA_PATH + "/" + fileName + str_type, //命名
                                })
                            }
                            setTimeout(() => wx.openDocument({
                                filePath: wx.env.USER_DATA_PATH + "/" + fileName + str_type, //打开
                                showMenu: true //支持分享
                            }).then(res => {
                                // console.log("打开成功")
                            }), 500);
                        }
                    })
                    downloadTask.onProgressUpdate((res) => {
                        let pro = res.progress.toString();
                        let procent = pro + '%';
                        // console.log(res, "res")
                        wx.showLoading({
                            title: procent,
                            mask: true
                        })
                        if (res.progress > 99) {
                            wx.hideLoading()
                        }
                    })
                }
            })
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})