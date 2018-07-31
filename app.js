//app.js
App({
    onLaunch: function () {

    },
    url: 'https://wxapp.softft.com',
    api(option) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        const url = this.url
        let def = {
            url: '',
            data: '',
            contentType: 'application/x-www-form-urlencoded',
            auth: true,
            success: false,
            fail: false,
            complete: false,
            method: 'post',
            loading: true
        }

        option = Object.assign(def, option)
        let code = wx.getStorageSync('code')
        let sessionid = wx.getStorageSync('sessionid')
        let that = this

        if (option.auth && !sessionid) {
            let that = this

            wx.login({
                success(e) {
                    wx.request({
                        url: url + option.url,
                        data: {
                            ...option.data,
                            code: e.code
                        },
                        method: option.method,
                        header: {
                            'content-type': option.contentType // 默认值
                        },
                        success: function (res) {
                            wx.hideLoading()
                            res = res.data;
                            if (res.code == 203) {

                                wx.redirectTo({
                                    url: '/pages/person/card/index'
                                })

                                return
                            }

                            wx.setStorageSync('code', e.code)
                            wx.setStorageSync('sessionid', res.data.sessionid)

                            option.success && option.success(res)
                            /* if(res.status){
                                 option.success && option.success(res)
                             }else{
                                 option.fail && option.fail(res)
                                 wx.showToast({
                                     title: res.msg || '未知错误',
                                     duration: 2000,
                                     icon: 'loading'
                                 })
                             }*/
                        },
                        fail(e) {
                            wx.hideLoading()
                            wx.showModal({
                                title: '提示',
                                content: JSON.stringify(e)
                            })

                            setTimeout(() => {
                                wx.showToast({
                                    title: '授权失败',
                                    duration: 2000,
                                    icon: 'loading'
                                })
                            }, 0)

                        },
                        complete(e) {

                            option.complete && option.complete()
                        }
                    })
                }
            })


            /*wx.login({
                success: res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    // 获取用户信息
                    let that = that
                    let data = res

                    wx.getSetting({
                        success: res => {
                            if (res.authSetting['scope.userInfo']) {
                                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                                wx.getUserInfo({
                                    success: res => {
                                        // 可以将 res 发送给后台解码出 unionId
                                        console.log(res)
                                        this.globalData.userInfo = res.userInfo
                                        // wx.setStroageSync('code')

                                    }
                                })
                            }else{
                                wx.navigateTo({
                                    url: '/pages/person/card/index'
                                })
                            }
                        }
                    })
                }
            })*/


        } else {
            let data
            if (!option.auth) {
                data = {
                    ...option.data
                }
            } else {
                data = {
                    ...option.data,
                    code,
                    sessionid
                }
            }

            if (option.loading) {
                wx.showLoading({
                    title: '加载中',
                    mask: true
                })

            }

            wx.request({
                url: url + option.url, //仅为示例，并非真实的接口地址
                data: data,
                method: option.method,
                header: {
                    'content-type': option.contentType // 默认值
                },
                success: function (res) {
                    wx.hideLoading()
                    res = res.data;

                    if (res.code == 202) { //失效
                        wx.removeStorageSync('code')
                        that.api(option)
                        return
                    } else if (res.code == 201) {
                        wx.removeStorageSync('code')
                        wx.removeStorageSync('sessionid')
                        that.api(option)

                        return
                    }

                    if (res.code == 200) {
                        option.success && option.success(res)
                    } else {
                        option.fail && option.fail(res)
                        wx.showToast({
                            title: res.msg || '未知错误',
                            duration: 2000,
                            icon: 'loading'
                        })
                    }
                },
                fail(e) {
                    wx.hideLoading()

                    /*wx.showModal({
                        title: '提示',
                        content: JSON.parse(e.data)
                    })*/

                    setTimeout(() => {
                        wx.showToast({
                            title: e.msg || '网络错误',
                            duration: 2000,
                            icon: 'loading'
                        })
                    }, 0)


                },
                complete(e) {

                    option.complete && option.complete()
                }
            })
        }


    },
    showTip(mes) {
        wx.showModal({
            title: '提示',
            content: mes || ' 网络错误',
            showCancel: false
        })
    },
    remove(e, key) {
        let arr = []

        for (var i in e) {
            if (i == key) {
                continue
            }

            arr.push(e[i])

        }
        return arr
    },
    addImage(num) {
        let that = this

        return new Promise((resolve,reject)=>{
            wx.chooseImage({
                count: num ? num : 9, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    wx.showLoading({
                        title: '加载中',
                        mask: true
                    })
                    for (let i in res.tempFilePaths) {
                        // that.upImage(res.tempFilePaths[i],res=>{
                        res.tempFilePaths[i] = that.upImage(res.tempFilePaths[i])
                        // })
                    }
                    // console.log(res.tempFilePaths)
                    Promise.all(res.tempFilePaths).then((value) => {
                        wx.hideLoading()

                        resolve(value)
                        // callback && callback(res.tempFilePaths)
                    })

                    // console.log(img)


                }
            })
        })

    },
    upImage(tem) { // change 替换


        return new Promise((resolve, reject) => {
            wx.uploadFile({
                url: this.url + '/misc/image',
                filePath: tem,
                name: 'file',
                formData: {
                    code: wx.getStorageSync('code'),
                    sessionid: wx.getStorageSync('sessionid'),
                    type: 'images',
                    file: tem
                },
                success: function (res) {
                    // wx.hideLoading()
                    var data = JSON.parse(res.data)
                    // console.log(data)
                    if (data.status) {

                        resolve(data.data.thumb_url[0])

                    } else {
                        reject(false)
                        app.showTip(data.msg)

                    }


                    //do something
                }
            })
        })


    },

    // 选择视频
    addVideo(){
        var that = this
        return new Promise((resolve,reject)=>{

            wx.chooseVideo({
                sourceType: ['album','camera'],
                maxDuration: 60,
                camera: 'back',
                compressed: true,
                success: function(res) {
                    wx.showLoading({
                        title: '加载中',
                        mask: true
                    })
                    that.upVideo(res.tempFilePath).then((res)=>{
                        wx.hideLoading()
                        resolve(res)
                    })
                }
            })
        })


    },
    upVideo(tem){
        let that = this
        return new Promise((resolve,reject)=>{

            wx.uploadFile({
                url: that.url + '/misc/video',
                filePath: tem,
                name: 'file',
                method: 'post',
                header: {'content-type': 'multipart/form-data'},
                formData: {
                    code: wx.getStorageSync('code'),
                    sessionid: wx.getStorageSync('sessionid'),
                    file: tem
                },
                success: function (res) {
                    var data = JSON.parse(res.data)
                    // console.log(data)
                    if (data.status) {

                        resolve(data.data.video_url[0])



                    } else {
                        wx.hideLoading()
                        app.showTip(data.msg)

                    }


                    //do something
                }
            })
        })

    }

})