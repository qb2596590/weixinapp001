import {
    areaList
} from '../../areaList/index';
const json = require("../../json/station_name")
const db = wx.cloud.database();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 1,
        active_tab: 0,
        areaList, //地区文件
        station: '',
        resetNums: 130201,
        station: {}, //图片列表
        pic_url: '',
        loading: false,
        picView: '',
        rules_url: '',
        input_value: '',
        txt: '',
        duanList: {}
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
        } else if (event.detail == 2) {
            wx.redirectTo({
                url: '/pages/rules/rules',
            })
        }else if (event.detail == 3) {
            wx.redirectTo({
                url: '/pages/handbook/handbook',
            })
        }
    },

    areaEnter(e) { //点击确认
        let station_name = e.detail.values[2].name;
        // console.log(e.detail.values[1].name)
        db.collection('station_database')
            .where({
                station_name: station_name
            })
            .get()
            .then(res => {
                let url = res.data[0].station_pic;
                let view_url = res.data[0].station_picView
                if (url == undefined || view_url == undefined) {
                    wx.showToast({
                        title: '暂无数据',
                    })
                }
                this.setData({
                    station: station_name,
                    pic_url: url,
                    picView: view_url,
                    loading: true,
                    rules_url: res.data[0].station_rules,

                })
                if (res.data[0].station_pic == "") {
                    wx.showToast({
                        title: '暂无此车站数据',
                        icon: 'none',
                        mask: true,
                        duration: 1500
                    })
                    this.setData({
                        loading: false
                    })
                }
                // console.error(this.data.file_1_name.length)
                // wx.hideLoading()
            })
            .catch(() => {
                wx.showToast({
                    title: '暂无此车站数据',
                    icon: 'none',
                    mask: true,
                    duration: 1500
                })
            })
    },
    resetNums() { //点击重置
        this.setData({
            resetNums: 110101
        })
    },
    backHome() { //底部返回
        wx.navigateTo({
            url: '/pages/index/index',
        })
    },
    onSearch(e) {
        let station_name = e.detail;
        db.collection('station_database')
            .where({
                station_name: station_name
            })
            .get()
            .then(res => {
                let url = res.data[0].station_pic;
                let view_url = res.data[0].station_picView
                if (url == undefined || view_url == undefined) {
                    wx.showToast({
                        title: '暂无此车站数据',
                        icon: 'none',
                        mask: true,
                        duration: 1500
                    })
                }
                this.setData({
                    station: station_name,
                    pic_url: url,
                    picView: view_url,
                    loading: true,
                    rules_url: res.data[0].station_rules,

                })
                if (res.data[0].station_pic == "") {
                    wx.showToast({
                        title: '暂无此车站数据',
                        icon: 'none',
                        mask: true,
                        duration: 1500
                    })
                    this.setData({
                        loading: false
                    })
                }
                // console.error(this.data.file_1_name.length)
                // wx.hideLoading()
            })
            .catch(() => {
                wx.showToast({
                    title: '暂无此车站数据',
                    icon: 'none',
                    mask: true,
                    duration: 1500
                })
            })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
        this.setData({
            duanList: json.duan
        })
    },
    onClickGrid(e){
        wx.navigateTo({
          url: '/pages/station_1/station_1?duan='+e.currentTarget.dataset.name,
        })
    },
    previewImg(o) {
        if (this.data.pic_url) {
            wx.previewImage({
                current: this.data.pic_View,
                urls: [this.data.pic_url]
            })
        }

    },

    downLoad_file_1(e) {
        const manage = wx.getFileSystemManager(); //本地持久
        let url = this.data.rules_url; //获取点击的文件Url
        var fileName = this.data.station + '《站细》'; //定义文件名
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
                console.log(res)
            },
            fail(res) {
                // 文件不存在或其他错误
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
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})