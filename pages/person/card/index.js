const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.timeSet()
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
    send(e) {
        var res = e.detail.value

        if (!res.id_number) {
            app.showTip('请输入身份证号')
        } else if (!res.mobile) {

            app.showTip('请输入手机号码')
        } else if (!res.mobile_code) {
            app.showTip('请输入验证码')
        } else if (!res.realname) {
            app.showTip('请输入真实姓名')
        } else {

            this.setData({
                show: true,
                ...res
            })
        }
    },
    // 授权
    UserInfo_click(e){
        let that = this
        if(e.currentTarget.dataset.name == 0){
            wx.showToast({
              title: '注册失败'
            })
        }else{
            that.setData({
                show: false
            })
            wx.showLoading({
                title: '正在提交信息',
                mask: true
            })

            let data = this.data
            e = e.detail
            wx.login({
                success(r){

                    app.api({
                        url: '/account/login/get_user_info',
                        data:{
                            realname: data.realname,
                            id_number: data.id_number,
                            mobile: data.mobile,
                            encryptedData: e.encryptedData,
                            iv: e.iv,
                            code: r.code,
                            mobile_code: data.mobile_code
                        },
                        auth:false,
                        success(res){

                            if(res.status){
                                wx.hideLoading()

                                wx.setStorageSync('sessionid',e.sessionid)
                                wx.setStorageSync('code',r.code)
                                wx.setStorageSync('userInfo',res.userInfo)

                                wx.showToast({
                                    title: '注册成功',
                                    duration: 3000
                                })
                                setTimeout(()=>{
                                    wx.switchTab({
                                        url: '/pages/main/main'
                                    })
                                },1500)
                            }else{
                                wx.showToast({
                                    title:  res.msg,
                                    icon: 'none',
                                    duration: 1500
                                })
                            }



                        },
                        complete(res){
                            that.setData({
                                show: false
                            })
                        }
                    })

                },
                faile(e){
                    wx.showToast({
                      title: '注册失败',
                      icon: 'none'
                    })
                }
            })
        }



    },

    inputBlur(e){
      this.setData({
          mobile: e.detail.value
      })
    },
    getCode(e) {
        let mobile = this.data.mobile
        let codeStatus = this.data.codeStatus

        if(codeStatus){

        }else{
            if(!mobile){
                app.showTip('请输入正确的手机号码')
                return
            }

            app.api({
                url: '/misc/sms/send',
                auth: false,
                cp: this,
                data:{
                    mobile
                },
                success(e){
                    wx.showToast({
                      title: '发送成功'
                    })
                     this.cp.timeSet()
                    console.log(e)
                }
            })
        }


    },
    timeSet(){
        let time = 120

        let iter = setInterval(()=>{
            time = time - 1
            if(time > 0){
                this.setData({
                    codeStatus: `重新获取(${time})`
                })
            }else{
                clearInterval(iter)
                this.setData({
                    codeStatus: false
                })
            }

        },1000)

    }

})
