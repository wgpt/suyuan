const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list_status: {
            "0": {
                value: '审核中溯源',
                one: false,
                two: false
            },
            "1": {
                value: '审核通过溯源',
                one: true,
                two: true
            },
            "2": {
                value: '审核未通过溯源',
                one: false,
                two: true
            }

        },
        url_status: 0,
        list: [],
        pageNo: 1,
        listNoDo: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({title:this.data.list_status[options.status].value});
        this.setData({
            url_status: options.status
        })

        this.getList()

        // console.log(this.data.url_status,this.data.list_status,this.data.list_status[this.data.url_status])
    },

    getList(){
        if(!this.data.lowerEnd && this.data.listNoDo){

            app.api({
                url: '/product/records',
                method: 'get',
                cp: this,
                data:{
                    pageNo: this.data.pageNo,
                    status: this.data.url_status
                },
                success(res){
                    let list = res.data.list

                    if(list.length  == 0){
                        // console.log(list)
                        this.cp.setData({
                            loading: true,
                            lowerEnd:  true
                        })
                    }else{
                        // console.log(list)
                        this.cp.setData({
                            list: this.cp.data.list.concat(list),
                            listNoDo: true
                        })
                    }




                }
            })
        }



    },

    lower(e){
      this.setData({
          loading: true,
          listNodo: false,
          pageNo: this.data.pageNo + 1
      },()=>{
          this.getList()
      })


    },

    del(e){

        let that = this
        wx.showModal({
            title: '提示',
            content: '你确定要删除此记录',
            success(m){
                if(m.confirm){
                    app.api({
                        url: '/product/records/delete',
                        cp: that,
                        data:{
                            id: e.currentTarget.dataset.id
                        },
                        success(res){
                            if(res.status){
                                wx.showToast({
                                    title: '删除成功'
                                })

                                let list = this.cp.data.list

                                list = app.remove(list,e.currentTarget.dataset.index)

                                this.cp.setData({
                                    list
                                })

                            }
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