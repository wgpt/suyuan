const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {

        error_msg:{
            description: "请添加操作说明",
            title: "请输入操作名称",
            worker: "请输入操作人名称"
        },

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let now = new Date();

        this.setData({
            now_time: now.getFullYear() + '-' + zero(now.getMonth()+1) + '-' + zero(now.getDate())
        })

        if(options.id){
            app.api({
                url: '/product/records/edit',
                method: 'get',
                data:{
                    id: options.id
                },
                cp: this,
                success: function (res) {
                    let data = res.data.product
                    let list = []
                    let index = []
                    let records = res.data.records
                    let idIndex = 0;

                    for (var i in data) {
                        list.push(data[i].name)
                        index.push(data[i].id)
                        if(data[i].id == records.productid){
                            idIndex = i
                        }
                    }
                    let images = []
                    let images_url = []
                    for(var i in records.images){
                        images.push(records.images[i].thumb)
                        images_url.push(records.images[i].thumb_url)
                    }
                    records.images = images
                    console.log(data)
                    this.cp.setData({
                        idList: list,
                        ids: index,
                        idIndex: idIndex,
                        images_url,
                        ...records,
                        video: records.video.video,
                        video_url: records.video.video_url,

                    })



                }
            })
        }else{
            app.api({
                url: '/product/records/add',
                method: 'get',
                cp: this,
                success: function (res) {
                    let data = res.data.product
                    let list = []
                    let index = []

                    for (var i in data) {
                        list.push(data[i].name)
                        index.push(data[i].id)
                    }

                    this.cp.setData({
                        idList: list,
                        ids: index
                    })

                }
            })
        }


    },

    videoClick(e){
      app.addVideo().then(res=>{
          console.log(res)
          this.setData({
              video: res[1],
              video_url: res[0]
          })
      })
    },


    bindDateChange(e){
      this.setData({
          work_time: e.detail.value
      })
    },

    formSubmit(e) {
        let data = e.detail.value


        for(var i in data){
            if(!data[i]){
                app.showTip(this.data.error_msg[i]);
                return
            }
        }

        if(!this.data.ids[this.data.idIndex]){
            app.showTip('请选择所属产品');
            return
        }

        if(!this.data.work_time){
            app.showTip('请选择作业时间');

            return
        }

        if(!this.data.images){
            app.showTip('请添加图片');
            return
        }

        if(this.data.id){
            app.api({
                url: '/product/records/edit',
                method: 'post',
                data:{
                    id: this.data.id,
                    productid: this.data.ids[this.data.idIndex],
                    images: this.data.images,
                    video: this.data.video,
                    work_time: this.data.work_time,
                    ...data
                },
                success(res){
                    if(res.status){
                        wx.showToast({
                            title: '保存成功',
                            duration:3000
                        })

                        setTimeout(()=>{
                            wx.switchTab({
                                url: '/pages/person/index'
                            })

                        },2000)

                    }else{
                        app.showTip(res.msg)
                    }
                }

            })
        }else{
            app.api({
                url: '/product/records/add',
                data:{
                    productid: this.data.ids[this.data.idIndex],
                    images: this.data.images,
                    video: this.data.video,
                    work_time: this.data.work_time,
                    ...data
                },
                success(res){
                    if(res.status){
                        wx.showToast({
                            title: '添加成功',
                            duration:3000
                        })

                        setTimeout(()=>{
                            wx.switchTab({
                                url: '/pages/person/index'
                            })

                        },2000)

                    }else{
                        app.showTip(res.msg)
                    }
                }

            })
        }


        // console.log(e)
    },
    bindPickerChange(e){
        // console.log(e)
        this.setData({
            idIndex: e.detail.value
        })
    },
    // 选择图片
    addClick(e) {
        let that = this
        let name = e.currentTarget.dataset['name']

        wx.chooseImage({
            count: name?1:9, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    if(name){
                        that.upImage(res.tempFilePaths[0],true,e.currentTarget.dataset.index)
                    }else{
                        for(var i in res.tempFilePaths){
                            that.upImage(res.tempFilePaths[i])

                        }
                    }


                // console.log(img)


            }
        })
    },
    upImage(e) { // change 替换
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        let that = this
        let name = e.currentTarget.dataset['name']


        app.addImage().then((res)=>{
            wx.hideLoading()
            let images = that.data.images || [];
            let images_url = that.data.images_url || [];
            // console.log(data)

                if(name){
                    let index = e.currentTarget.dataset['index']
                    // console.log(images,index)
                    images[index] = res[0][1]
                    images_url[index] = res[0][0]
                    // console.log(images);
                }else{
                    for(var i in res){
                        images.push(res[i][1])
                        images_url.push(res[i][0])
                    }


                    // console.log(images);

                }

                that.setData({
                    images: images,
                    images_url
                })
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
                let images = that.data.images || [];
                // console.log(data)
                if (data.code == 200) {

                    if(change){
                        console.log(images,index)
                        images[index] = data.data.thumb_url[0]
                        // console.log(images);
                    }else{

                        images.push(data.data.thumb_url[0])
                        // console.log(images);

                    }

                    that.setData({
                        images: images
                    })




                } else {
                    app.showTip(data.msg)

                }


                //do something
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


function zero(x) {
    if( x > 0 && x < 10 ){
        return '0' + x
    }else if(x < 0){
        return '00'
    }else{
        return x
    }
}