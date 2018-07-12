Page({

    /**
     * 页面的初始数据
     */
    data: {
        list_status: {
            "1": {
                value: '审核中溯源',
                one: false,
                two: false
            },
            "2": {
                value: '审核未通过溯源',
                one: true,
                two: true
            },
            "3": {
                value: '审核通过溯源',
                one: false,
                two: true
            }

        },
        url_status: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({title:this.data.list_status[options.status].value});
        this.setData({
            url_status: options.status
        })

        console.log(this.data.url_status,this.data.list_status,this.data.list_status[this.data.url_status])
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