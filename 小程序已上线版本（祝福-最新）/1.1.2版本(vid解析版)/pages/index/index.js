import request from "../../utils/request"
const app = getApp()

// counter用来做分页的，计数下滑次数：第一部分
var countertj = 0;
var countertjxl = 0;

// 插屏广告,第一部分
let interstitialAd = null

Page({
  data: {
    //控制头部提醒
    qtshow:true,
    tixing: true,
    containermarginTop: "224rpx",
    duihuashow: true,
    noticemove: 0,  //开始是上拉对话框是隐藏的，需要的时候把noticemove设置为1就可以了
    notice: false,
    // 初始化当前页面
    page:0,
    // 控制插屏广告
    tcshow:true,   //初始化定义show为true
    time: 15,        //定义时间为15秒
    cpgg: true,
    //用于头部导航栏判断是否是当前选中的 
    first_id: 0,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    tjnum:5,
    sharebtn:{
      sharetitle: "【点击播放】频戳中你的泪点没有？赶紧点进来看看吧！",
      shareimgurl: "/image/indexshare.png",
      sharepath: "pages/index/index"
    }   ,

    //导航栏---------------------
    first_names: [
      {"id": 1,"goods_name": "推荐"
      },
      {"id": 2,"goods_name": "搞笑"
      },
      {"id": 3,"goods_name": "祝福"
      },
      {"id": 4,"goods_name": "健康"
      },
      {"id": 5,"goods_name": "妙招"
      },
      {"id": 6,"goods_name": "精彩"
      },
      {"id": 7,"goods_name": "歌舞"
      },
      {"id": 8,"goods_name": "人生"
      },
      
    ],

    //置顶轮播
    sliderList: [
    ], 
   
    // 1、视频列表推荐
   myVideoList:[
          // {
          //   id: 1,
          //   auth: "张三",
          //   title: "这个视频没火我难受 ",
          //   fmimage: "/image/tjfm/1.22.jpg",
          //   videourl: "t3035flep1f",
          //   zjnum:5,
          //   
          // },
        ] ,
    // 2、视频列表搞笑
    myVideoListGaoxiao:[],
    // 3、视频列表祝福
    myVideoListZhufu:[],
    // 4、视频列表健康
    myVideoListJiankang:[],
    // 5、视频列表妙招
    myVideoListMiaozhao:[],
    // 6、视频列表精彩
    myVideoListJingcai:[],
    // 7、视频列表歌舞
    myVideoListGewu:[ ],
    // 8、视频列表人生
    myVideoListRensheng:[],

  },

 //监听前贴广告
  onAdplay(e) {
    console.log('前贴广告开始', e)
  },
  onAdload(e) {
    console.log('前贴广告加载成功', e)
    let _this = this
    _this.setData({
      qishow:true
    })
    
  },
  onAdclose(e) {
    console.log('前贴广告关闭', e)
  },
  onAdError(e) {
    console.log('前贴广告加载失败', e)
  },


  // 生命周期------初始化页面--------------------
  onLoad: function () { 

    let _this = this
    // 初始化视频数据的方法
    _this.listTuijian()
    _this.zhiding()
  
    // 初始化插屏广告，在有需要的地方调用，第二部分
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-0a77a4cc3439c153'
      })
      interstitialAd.onLoad(() => {
        console.log('插屏 广告加载成功')
      })
      interstitialAd.onError((err) => {
        console.log('插屏 广告加载失败', err)
      })
      interstitialAd.onClose((res) => {
        console.log('关闭插屏广告', res)
      })

    }

      // 定时控制插屏广告
      // var interval = setInterval(function () {
      //   var timenew = this.data.timecpgg - 1
      //   this.setData({
      //     timecpgg: timenew
      //   })
      //   if (this.data.timecpgg == 0) {
      //     this.setData({
      //       cpgg: true,          //如果time的值为0时，将data里面show的值改为true,图片就可以显示了
      //       timejigg: 12
      //     })
      //   }
      // }, 1000)



    // 在适合的场景显示插屏广告
    // if (interstitialAd) {
    //   if (this.data.cpgg) {
    //     console.log("cpgggggggg")
    //     interstitialAd.show().catch((err) => {
    //       console.error(err)
    //     })
    //   }
    // }

     // 10、从后台读取自定义分享封面-----
     request({
      url:'api/Fengmian',
    }).then(res=>{
      if (res.data.length >= 1) {
        console.log("------读取自定义分享封面----")
        var newsharebtn = {
          sharetitle: res.data[0].title,
          shareimgurl: res.data[0].fmimage,
          sharepath: res.data[0].path
        }
        // 将自定义封面图片和标题赋值给sharebtn
        _this.setData({
          sharebtn: newsharebtn
        })
      } 
    }).catch(err=>{
      console.log(err)
    }) 
   
   

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  //生命周期-----监听页面变化------------
  onShow: function () {
    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      console.log("调用插屏广告")
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }


    // 弹窗广告
      //  var that = this
      //   var interval = setInterval(function () {
      //     var timenew = that.data.time - 1
      //     that.setData({
      //       time: timenew
      //     })
      //     if (that.data.time == 0) {
      //       // clearInterval(interval)
      //       that.setData({
      //         tcshow: true,          //如果time的值为0时，将data里面show的值改为true,图片就可以显示了
      //         time:15
      //       })
      //     }
      //   }, 1000)
      
        // setInterval(function () { 
        //   that.setData({
        //       tcshow: true          //如果time的值为0时，将data里面show的值改为true,图片就可以显示了
        //   })
        //  }, 10000)
  },
  
  // 设置定时器，用于分页下拉触底分页请求数据--------------
  //计数下滑次数：第二部分
  addtj() {return countertj += 1;},
  addzfxl() {return counterxl += 1;},


  // 下拉刷新触发函数--------------------------
  onPullDownRefresh: function () {
    console.log("下拉刷新")
    //  在当前路由下拉触底追加相对应的数据-----
    let that = this
    // 计数下滑次数：第三部分
    var dtj = that.addtj()
    var sktj = dtj * 6

    var page = that.data.page
    switch (page) {
      case 0:
        //  1、推荐页下拉刷新   
        wx.request({
          url: "https://www.otvllat.cn/api/Article",
          data: { lim: 6, sk: sktj },
          method: "GET",
          success: function (res) {
            // console.log(res.data)
            let oldlist = that.data.myVideoList
            let newlist = res.data
            let addlist = newlist.concat(oldlist)
            // console.log(addlist)
            that.setData({
              myVideoList: addlist
            })
          }
        });
        break;   
       
    }   
  },

  // 下拉到底触发函数--------------------------
  onReachBottom: function () {
    console.log('到底了！')
    let that = this
    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      if (that.data.tcshow){
        interstitialAd.show().catch((err) => {
          console.error(err)
        })
      } 
    }
    // 追加数据
   
    // console.log("data"+that.data.tcshow)
    

    // 计数下滑次数：第三部分
    var dtj = that.addtj()
    // var dgx = that.addgx()
    // var dzf = that.addzf()
    // var djk = that.addjk()
    // var dmz = that.addmz()
    // var djc = that.addjc()
    // var dgw = that.addgw()
    // var drs = that.addrs()
     
    // console.log("当前页："+that.data.page)
    var page = that.data.page

  // 1、 推荐页----追加-------------- 
      var sktj = dtj * 6
      // var skgx = dgx * 6
      // var skzh = dzf * 6
      // var skjk = djk * 6
      // var skmz = dmz * 6
      // var skjc = djc * 6
      // var skgw = dgw * 6
      // var skrs = drs * 6

    //  在当前路由下拉触底追加相对应的数据-----
    switch (page) {
      case 0:  
        //  1、推荐页追加    
          wx.request({
            url: "https://www.otvllat.cn/api/Article",
            data: { lim: 6, sk: sktj },
            method: "GET",
            success: function (res) {
              // console.log(res.data)
              let oldlist = that.data.myVideoList
              let newlist = res.data
              let addlist = oldlist.concat(newlist)
              // console.log(addlist)
              that.setData({
                myVideoList: addlist
              })
            }
          }) ;    
        break; 
    }     
  
  },
  

 

      //置顶
      zhiding() {
        let that = this
        wx.request({
          url: "https://www.otvllat.cn/api/ArticleZhiding",
          method: "GET",
          success: function (res) {
            console.log("已经请求到了置顶")
            that.setData({
              sliderList: res.data
            })

          }
        })
      },

    

    // 置顶部分点击视频去详情页------------------
   goDetailzd(e){
     //videourl 现在是vid形式的
     var index = e.currentTarget.dataset.index
     var url = e.currentTarget.dataset.videourl     
     var userimage = e.currentTarget.dataset.userimage
     var title = e.currentTarget.dataset.videotitle
     var auth = e.currentTarget.dataset.auth
     

     if (index == 2) {
       wx.navigateToMiniProgram({
         appId: 'wxc75c72dd80209003',
         path: '',
         envVersion: 'release',// 打开正式版
         success(res) {
           console.log("打开成功")
         },
         fail: function (err) {
           console.log(err);
         }
       })
     }else{
     wx.navigateTo({
       url: '/pages/index/detail/detail?videourl=' + encodeURIComponent(url) + '&videotitle=' + encodeURIComponent(title)
         + '&userimage=' + userimage +'&auth=' + encodeURIComponent(auth)
     })
     }    
   },

  // 推荐点击视频去详情页------------------
  goDetailtj(e) {

    //  videourl 现在是vid形式的
    var url = e.currentTarget.dataset.videourl
    var title = e.currentTarget.dataset.videotitle
    var userimage = e.currentTarget.dataset.userimage
    var auth = e.currentTarget.dataset.auth
    var index = e.currentTarget.dataset.index
    console.log("当前点击的索引是------"+index)
    //  var vid = e.currentTarget.dataset.videourl  
    //  var haha


  //  点击索引为偶数的时候才提示跳转小程序
    if (index % 2 === 0 & index != 0){
      wx.showModal({
        title: '提示',
        content: '即将进入高清页面进行播放',
        success(res) {
            if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateToMiniProgram({
                  // 跳转到图文看看看
                  appId: 'wxc75c72dd80209003',
                  path: '',
                  envVersion: 'release',// 打开正式版
                  success(res) {
                    console.log("打开成功")
                  },
                  fail: function (err) {
                    console.log(err);
                  }
                })
            } else if (res.cancel) {
                  console.log('用户点击取消')
                  wx.navigateToMiniProgram({
                    // 跳转到图文看看看
                    appId: 'wxc75c72dd80209003',
                    path: '',
                    envVersion: 'release',// 打开正式版
                    success(res) {
                      console.log("打开成功")
                    },
                    fail: function (err) {
                      console.log(err);
                    }
                  })
            }
          }
        })
  
    }else{
          wx.navigateTo({
            url: '/pages/index/detail/detail?videourl=' + encodeURIComponent(url) + '&videotitle=' + encodeURIComponent(title)
              + '&userimage=' + encodeURIComponent(userimage) +'&auth=' + encodeURIComponent(auth)
          })
    }

  },
   

    // 1、初始化视频列表推荐----------------------------
  listTuijian(){
    let that = this   
      wx.request({
        url: "https://www.otvllat.cn/api/Article",
        data:{lim:6,sk:0,},
        method: "GET",
        success: function (res) {
          that.setData({
            myVideoList:res.data
          })
          
        }
      })          
    },
    
  


  // 头部点击显示对话框-----------
  duihua() {
    let _this = this
    if (_this.data.duihuashow) {
      _this.setData({
        // notice是控制对话框显隐的，duihuashow:false是控制对话框出现过一次之后就不能在出现了，noticemove: 1是对话框弹出的动画
        noticemove: 1,
        notice: true,
        duihuashow: false
      })
    } else {
      console.log('提醒对话框已经出现过，点击时应该自动关闭头部提醒')
      _this.tixingclose()
    }

  },
  //  关闭顶部提示框
  tixingclose() {
    console.log("关闭顶部提示框")
    let _this = this
    _this.setData({
      tixing: false,
      containermarginTop: "130rpx"
    })
  },
  //换一批
  huanyipi() {
    console.log('换一批')
    let _this = this
    if (_this.data.duihuashow) {
      // _this.duihuakuang()
      _this.setData({
        // notice是控制对话框显隐的，duihuashow:false是控制对话框出现过一次之后就不能在出现了，noticemove: 1是对话框弹出的动画
        noticemove: 1,
        notice: true,
        duihuashow: false,
      })
    } else {
      console.log('已经出现过提示框，这里发送刷新请求了')
      wx.request({
        url: "https://www.otvllat.cn/api/Article",
        data: { lim: 6, sk: 6 },
        method: "GET",
        success: function (res) {
          // console.log(res.data)
          let oldlist = _this.data.myVideoList
          let newlist = res.data
          let addlist = newlist.concat(oldlist)
          // console.log(addlist)
          _this.setData({
            myVideoList: addlist
          })
        }
      });
    }
  },


  //对话允许
  duihuayunxu(e) {
    let _this = this
    console.log('关闭对话框--允许' + e)
    _this.setData({
      noticemove: 2,
    })
  },
  //对话取消
  duihuaquxiao(e) {
    let _this = this
    console.log('关闭对话框——取消' + e)
    _this.setData({
      noticemove: 2,
    })
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },

  // 轮播
  lunbo(e) {
    console.log('点击了轮播' + e.currentTarget.dataset.videourl)
    console.log('点击了轮播' + e)
  },

  //相册跳转小程序
  pic(){
    wx.navigateToMiniProgram({
      appId: 'wxc75c72dd80209003',
      path: '',
      envVersion: 'release',// 打开正式版
      success(res) {
        console.log("打开成功")
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },


  // 小程序分享
  onShareAppMessage: function (res) {
    let _this = this
     if (res.from === 'button') {
     }
     if (_this.data.sharebtn.sharetitle){
       return {
         title: _this.data.sharebtn.sharetitle,
         path: _this.data.sharebtn.sharepath,
         imageUrl: _this.data.sharebtn.shareimgurl,
         // desc: '自定义内容',
       }
     }     
},

    scroll(e) {
      console.log('下滑')
      if (interstitialAd) {
          interstitialAd.show().catch((err) => {
            console.error(err)
          })
    }
  }


})
