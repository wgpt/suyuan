const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        mul: [['家禽', '农作物'], ['鸡', '猪']],
        multIndex: false,
        list: [
            ['鸡', '猪'],
            ['苹果', '菜心']
        ],
        images: [],
        images_url: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.status == 1) {
            wx.setNavigationBarTitle({title: '溯源信息采集-添加图片'});
        }


        let that = this


        if (options.id) { // 编辑

            app.api({
                url: '/images/index/edit',
                method: 'get',
                data: {
                    id: options.id
                },
                success(res) {

                    if (res.status) {
                        res = res.data
                        let category = res.category
                        let first = []
                        let second = []
                        let id = []
                        let select = 0
                        console.log(res)
                        // console.log(res)
                        for (var i in category) {
                            first.push(category[i].name)
                            second[i] = []
                            id[i] = []
                            for (var j in category[i].childs) {

                                if (category[i].childs[j].catid == res.image.catid) {
                                    select = [i, j]
                                }
                                second[i].push(category[i].childs[j].name)
                                id[i].push(category[i].childs[j].catid)
                            }
                        }
                        that.setData({
                            multIndex: select, //选择
                            mul: [first, second[0]],
                            list: second,
                            catid: id, // 所有分类
                            preData: res.image,
                            pid: options.id,
                            name: res.image.title,
                            images: [res.image.thumb]
                        })


                    } else {

                        app.showTip(res.msg)
                    }

                }
            })

        } else { // 增加
            app.api({
                url: '/images/index/add',
                method: 'get',
                success(res) {
                    res = res.data.category
                    let first = []
                    let second = []
                    let id = []
                    // console.log(res)
                    for (var i in res) {
                        first.push(res[i].name)
                        second[i] = []
                        id[i] = []
                        for (var j in res[i].childs) {
                            second[i].push(res[i].childs[j].name)
                            id[i].push(res[i].childs[j].catid)
                        }
                    }
                    // console.log(first, second, id)
                    that.setData({
                        mul: [first, second[0]],
                        list: second,
                        catid: id // 所有分类
                    })

                }
            })
        }


    },

    upImage(tem) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        let that = this
        app.addImage().then((value)=>{
            if (that.data.pid) {
                that.setData({
                    'preData.thumb_url': value[0][0],
                    'preData.thumb': value[0][1]
                })

            } else {
                wx.hideLoading()
                let images = that.data.images
                let images_url = that.data.images_url

                for(var i in value){
                    images.push(value[i][1])
                    images_url.push(value[i][0])
                }


                // console.log(images);
                that.setData({
                    images: images,
                    images_url: images_url
                })
            }
        })

        return

        wx.uploadFile({
            url: app.url + '/misc/image',
            filePath: tem,
            name: 'file',
            formData: {
                code: wx.getStorageSync('code'),
                sessionid: wx.getStorageSync('sessionid'),
                type: 'images',
                file: tem
            },
            success: function (res) {
                wx.hideLoading()
                var data = JSON.parse(res.data)
                let images = that.data.images;
                // console.log(data)
                if (data.code == 200) {

                    if (that.data.pid) {
                        that.setData({
                            'preData.thumb': data.data.thumb_url[0]
                        })

                    } else {
                        images.push(data.data.thumb_url[0])
                        // console.log(images);
                        that.setData({
                            images: images
                        })
                    }


                } else {
                    app.showTip(data.msg)

                }


                //do something
            }
        })

    },
    inputBlur(e) {
        this.setData({
            name: e.detail.value
        })
    },
    pickerClick(e){

      if(!this.data.multIndex){
          this.setData({
              multIndex: [0,0]
          })

      }
    },

    sure(e) {
        let name = this.data.name

        if (!name) {
            app.showTip('请填入名称')
            return
        }

        let images = this.data.images.join(',')
        if (!images) {
            app.showTip('请选择至少一张图片')
            return
        }

        let catid = this.data.multIndex

        if (!catid) {
            app.showTip('请选择分类')
            return
        }

        if (this.data.pid) {
            app.api({
                url: '/images/index/edit',
                data: {
                    title: name,
                    catid: this.data.catid[catid[0]][catid[1]],
                    image: this.data.preData.thumb_url,
                    id: this.data.pid
                },
                success(e) {
                    if (e.status) {

                        wx.showToast({
                            title: '编辑成功',
                            duration: 3000
                        })
                        setTimeout(() => {
                            wx.redirectTo({
                                url: "/pages/photo/index"
                            })
                        }, 2000)


                    } else {
                        app.showTip(e.msg)
                    }
                }
            })
        } else {
            app.api({
                url: '/images/index/add',
                data: {
                    title: name,
                    catid: this.data.catid[catid[0]][catid[1]],
                    images: images
                },
                success(e) {
                    if (e.status) {

                        wx.showToast({
                            title: '保存成功',
                            duration: 3000
                        })
                        setTimeout(() => {
                            wx.redirectTo({
                                url: "/pages/photo/index"
                            })
                        }, 2000)
                    } else {
                        app.showTip(e.msg)
                    }
                }
            })
        }


    },

    delImg(e) {
        // console.log(e)
        let images = this.data.images

        images = app.remove(images, e.currentTarget.dataset.index)

        this.setData({
            images
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
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 多选确定
    bindMultiPickerChange(e) {
        console.log(e);

    },
    // 列表改动
    bindMultiPickerColumnChange(e) {

        if (e.detail.column < 1) {

            let m = this.data.mul;
            let index = this.data.multIndex ? this.data.multIndex : [0, 0]
            m[e.detail.column + 1] = this.data.list[e.detail.value]


            for (let i = e.detail.column + 1; i < index.length; i++) {

                index[i] = 0;
            }

            index[e.detail.column] = e.detail.value;

            console.log(m, index)
            this.setData({
                mul: m,
                multIndex: index
            })
        }

    },

    // 选择图片
    addClick() {
        let that = this
        wx.chooseImage({
            count: 9, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                for(var i in res.tempFilePaths){
                    that.upImage(res.tempFilePaths[i])
                }
                // console.log(img)


            }
        })
    }

})