

Page({

    /**
     * 页面的初始数据
     */
    data: {
        mul:  [['家禽', '农作物'], ['鸡', '猪']],
        multIndex: false,
        list:[
            ['鸡', '猪'],
            ['苹果','菜心']
        ],
        images: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
    bindMultiPickerChange(e){
        console.log(e);

    },
    // 列表改动
    bindMultiPickerColumnChange(e){

        if(e.detail.column < 1){

            let m = this.data.mul;
            let index= this.data.multIndex?this.data.multIndex:[0,0]
            m[e.detail.column + 1] = this.data.list[e.detail.value]


            for(let i = e.detail.column + 1;i < index.length;i++){

                index[i] = 0;
            }

            index[e.detail.column] = e.detail.value;

            console.log(m,index)
            this.setData({
                mul: m,
                multIndex: index
            })
        }

    },

    // 选择图片
    addClick(){
        let that = this
        wx.chooseImage({
            count: 9, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let images = that.data.images.concat(res.tempFilePaths);
                // console.log(images);
                that.setData({
                    images: images
                })
            }
        })
    }

})