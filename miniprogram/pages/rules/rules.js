const db = wx.cloud.database();
const _ = db.command;
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 2,
        activeKey: 0,
        sidebarList: {},
        cellList: {},
        type_1: '',
        // show_empty: true,
        isSearch: false,
        file_url: '',
        key_str:'',
        search_count:'',
        search_empty:false,
        search_cellList:{},
        isSearch:false,
        nbFrontColor: '#ffffff',
        nbBackgroundColor: '#39a9ed',
    },
    onChange(event) {
    
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
        }else if (event.detail == 3) {
            wx.redirectTo({
                url: '/pages/handbook/handbook',
            })
        }
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
    },
    onClick(e) { //点击上方选项卡
        db.collection('rules_sidebar').get().then(res => {
            let arr = res.data[0].sidebar_json
            let obj = []
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].type_1 == e.currentTarget.dataset.name) {
                    obj.push(arr[i])
                }
            }
            this.setData({
                // show_empty: false,
                type_1: e.currentTarget.dataset.name,
                sidebarList: obj,
                cellList: ''
            })
        })
    },
    onClickSidebar(e) { //点击侧边栏
        db.collection('rules_sidebar').get().then(res => {
            let arr = res.data[1].sidebar_json;
            let obj = [];

            for (let i = 0; i < arr.length; i++) {
                if (arr[i].type_1 === this.data.type_1 && arr[i].type_2 === e.currentTarget.dataset.type2) {
                    obj.push(arr[i])
                }
            }
            this.setData({
                // show_empty: false,
                cellList: obj
            })
        })
    },
    // ......................................

    onCancel(e) {
        // console.log(e)
        this.setData({
            isSearch: false
        })

    },
    onSearch(e) {
        this.setData({
            key_str: e.detail
        })
        db.collection('rules').where({
            name: db.RegExp({
                regexp: e.detail,
                options: 'i'
            })
        }).count().then(res => {
            if (res.total > 0 && res.total <= 30) {
                this.setData({
                    search_count: '共搜索到' + res.total + '条结果'
                })
            } else if (res.total > 30) {
                this.setData({
                    search_count: '搜索到>' + res.total + '<条结果，输入更多关键字以缩小范围!',
                })

            } else {
                this.setData({
                    // show_empty: false,
                    search_empty: true
                })
            }
        })
        db.collection('rules').where({
            name: db.RegExp({
                regexp: e.detail,
                options: 'i'
            })
        }).get().then(res => {
            this.setData({
                search_cellList: res.data,
                isSearch: true,
                // show_empty:false
            })
        })
    },
    scroll_onReachBottom(e) {
        console.error("2222");
        let len = this.data.search_cellList.length;
        // console.log(this.data.rules_type)
            db.collection('rules')
                .skip(len).limit(20)
                .where({
                    name: this.data.key_str,
                }).get().then(res => {
                    this.setData({
                        search_cellList: [...this.data.search_cellList, ...res.data]
                    })
                })
    },
    onClick_input() {
        this.setData({
            // show_empty: false,
            search_empty: false,
            isSearch: false

        })
    },
    onClick_focus() {
        this.setData({
            // show_empty: false,
            search_empty: false,
            isSearch: false
        })
    },
    onClick_clear() {
        this.setData({
            // show_empty: false,
            search_empty: false,
            isSearch: false
        })
    },
    onClickCell(e) {
        // let that = this;
        console.log(e);
        let file_name = e.currentTarget.dataset.file_name;
        db.collection('rules').where({
            name: file_name
        }).get().then(ress => {
        const manage = wx.getFileSystemManager(); //本地持久
        if (!ress.data[0].url) {
            wx.showToast({
                title: '资料待补充',
                icon: 'error',
                mask: true,
                duration: 500
            })
            return
        }
        var fileName = e.currentTarget.dataset.num1 + e.currentTarget.dataset.file_name + e.currentTarget.dataset.num2 //定义文件名
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
                    url: ress.data[0].url, //下载地址
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
    
    // ........................................
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