const json = require("../../json/station_name")
const db = wx.cloud.database();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        stationList: {},
        num: '',
        show: false,
        station:{}
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
        let str = options.duan;
        let obj = [];
        for (let i = 0; i < json.station.length; i++) {
            if (json.station[i].station == str) {
                obj.push(json.station[i])
            }
        }
        if (obj.length < 40) {
            this.setData({
                num: 3,
                stationList: obj
            })
        } else {
            this.setData({
                num: 5,
                stationList: obj
            })
        }
    },
    onClickGrid(e) {
        db.collection('station_database').where({
            station_name:e.currentTarget.dataset.name
        }).get().then(res=>{
            console.log(res);
            this.setData({
                show:true,
                station:res.data
            })
        })
    },
    picView(e){
        let url=e.currentTarget.dataset.picurl;
        let view=e.currentTarget.dataset.picview;
        if (url) {
            wx.previewImage({
                current: view,
                urls: [url]
            })
        }
    },
    downPDF(e) {
        const manage = wx.getFileSystemManager(); //本地持久
        let url = e.currentTarget.dataset.pdf_url; //获取点击的文件Url
        var fileName = e.currentTarget.dataset.name + '站《行车工作细则》'; //定义文件名
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
                // console.log(res)
            },
            fail(res) {
                // 文件不存在或其他错误
                // console.log(res)
                const downloadTask = wx.downloadFile({ //监听下载
                    url: url, //下载地址
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
    },
    onClose() {
        this.setData({
            show: false
        });
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