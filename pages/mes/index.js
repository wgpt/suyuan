const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: {

        },
        status: 0, // 0未审核1已审核,2审核未通过,空为全部
        pages: 1,
        end: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.getList()
    },

    getList(){
        let that = this
        app.api({
            url: '/video',
            method: 'get',
            data:{
                status: this.data.status,
                pageNo: this.data.pages,
                pageSize: 10
            },
            success(res){

                if(res.data.list.length == 0 && that.data.list.length > 0){

                    setTimeout(()=>{
                        wx.showToast({
                            title: '没有了哦',
                            icon: 'loading'
                        })
                    },0)

                    that.setData({
                        end: true
                    })

                }else{
                    that.setData({
                        list: [...that.data.list,...res.data.list],
                        pages: ++that.data.pages
                    })

                }



            }
        })
    },

    delImg(e){

        let that = this

        wx.showModal({
            title: '提示',
            content: '你确定要删除此视频',
            success(m){
                if(m.confirm){
                    app.api({
                        url: '/video/index/delete',
                        data: {
                            id: e.currentTarget.dataset.id
                        },
                        success(res){

                            if(res.status){
                                let list = that.data.list

                                list = app.remove(list,e.currentTarget.dataset.index)

                                that.setData({
                                    list
                                })
                            }

                            wx.showToast({
                                title: res.msg
                            })




                        }
                    })
                }
            }
        })

    },

    navClick(e){



        this.setData({
            status: e.currentTarget.dataset.st,
            end: false,
            pages: 1,
            list: []
        })

        this.getList()
    },

    lower(e){
        console.log(e)

        if(!this.data.end){
            this.getList()
        }

    },

    clickAll(e){
        let list = this.data.list
        if(this.data.mulStatus){


            for(var i in list){

                list[i]['select'] = false
            }

        }

        this.setData({
            mulStatus: !this.data.mulStatus,
            list
        })
    },

    listClick(e){
        if(this.data.mulStatus){

            let list = this.data.list
            list[e.currentTarget.dataset.index]['select'] = !list[e.currentTarget.dataset.index]['select']

            this.setData({
                list
            })

        }

    },

    delAll(e){

        let that = this


        wx.showModal({
            title: '提示',
            content: '你确定要删除所选视频',
            success(m){
                if(m.confirm){
                    wx.showLoading({
                        title: '提交中'
                    })
                    let list = that.data.list
                    let id = []
                    let index = []
                    for(var i in list){
                        if(list[i].select){
                            id.push(list[i].id)
                            index.push(i)
                        }
                    }

                    app.api({
                        url: '/video/index/delete',
                        data: {
                            id: id.join(',')
                        },
                        success(res){

                            if(res.status){
                                let list = that.data.list
                                for(var i in index){
                                    list = app.remove(list,index[i])
                                }


                                that.setData({
                                    list
                                })
                            }

                            wx.showToast({
                                title: res.msg
                            })




                        }
                    })
                }
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
        this.setData({
            end: false,
            pages: 1,
            list: []
        })

        this.getList()
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