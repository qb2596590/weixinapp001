const db = wx.cloud.database();
const _ = db.command;
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        fileList: {},
        type_1: '',
        type_2: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (!wx.getStorageSync('userid')) {
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
        db.collection('workdata').where({
            type_1: options.type,
            type_2: options.name
        }).orderBy('file_name', 'asc').get().then(res => {
            this.setData({
                fileList: res.data,
                type_1: options.type,
                type_2: options.name
            })
        })
    },

    onClickFile(e) { //打开并下载
        var id = e.currentTarget.dataset.id;
        wx.cloud.callFunction({
            name: 'file_count',
            data: {
                id,
            }
        }).then()
        var file_type = e.currentTarget.dataset.file_type;
        var file_name = e.currentTarget.dataset.file_name;
        var file_url = e.currentTarget.dataset.file_url;
        const manage = wx.getFileSystemManager(); //本地持久
        let temp = wx.env.USER_DATA_PATH + "/" + file_name + file_type
        // console.log(temp)
        // console.log(file_url);
        manage.access({ //判断本地文件是否存在
            path: temp,
            success(res) {
                // 文件存在
                wx.openDocument({
                    filePath: wx.env.USER_DATA_PATH + "/" + file_name + file_type, //打开
                    showMenu: true, //支持分享       
                })
                // console.log(res)
            },
            fail(res) {
                // 文件不存在或其他错误
                // console.log(res)
                // console.log(file_url);
                const downloadTask = wx.downloadFile({ //监听下载
                    url: file_url, //下载地址
                    success(res) { //成功回调
                        // console.log(res)
                        if (res.statusCode === 200) {
                            //将临时地址转存到本地缓存中（要点）
                            manage.saveFile({
                                tempFilePath: res.tempFilePath, //临时地址
                                filePath: wx.env.USER_DATA_PATH + "/" + file_name + file_type, //命名
                            })
                        }
                        setTimeout(() => wx.openDocument({
                            filePath: wx.env.USER_DATA_PATH + "/" + file_name + file_type, //打开
                            showMenu: true //支持分享
                        }).then(res => {
                            // console.log("打开成功")
                        }), 500);
                    }
                })
                downloadTask.onProgressUpdate((res) => {
                    // console.log(res);
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

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let len = this.data.fileList.length;
        db.collection('workdata')
            .skip(len).limit(20)
            .where({
                type_1: this.data.type_1,
                type_2: this.data.type_2
            }).orderBy('file_name', 'asc').get().then(res => {
                this.setData({
                    fileList: [...this.data.fileList, ...res.data]
                })
            })
    },
})