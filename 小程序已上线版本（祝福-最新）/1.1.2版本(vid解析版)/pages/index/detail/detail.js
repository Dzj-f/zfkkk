
import request from "../../../utils/request"
// counter用来做分页的，计数下滑次数：第一部分
var counterzj = 0;

// 插屏广告,第一部分
let interstitialAd = null
Page({
  onShareAppMessage() {
    return {    
    }
  },

  data: {
    checkimg:"checkimg",
    timecpgg:10,
    cpgg: false,
    // 播放结束
    playend:false,
    videoend:false,
    myvideoback:false,
    kouzhao:true,
    //控制头部提醒
    qtshow: true,
    tixing: true,
    containermarginTop: "312rpx",
    duihuashow: true,
    noticemove: 0,  //开始是上拉对话框是隐藏的，需要的时候把noticemove设置为1就可以了
    notice: false,
    // 订阅
    dingyue:false,
    //添加客服
    addkf:false,
    // 推荐指数 
    tjnum:5,  
    toView: 'green',
    width: "100%",
    height: "100%", 
    video: [ 
      {
        videourl: "http://smydzd.qq.com/uwMROfz2r57EIaQXGdGnC2ddiMXVEb-sx1qd-RYMiF6MDWfW/shg_611991306_50001_b800d8a2055d47a295ae09364ee022d6.f612.mp4?vkey=65DE2C4758C4F9F45640324E30CA1BA33ECD6A6F80D113FCD89E4796217F1A3732941BD769C8E978FDE694765334A4953AE809D10B20177A7CB7125A1DA8022EE0A0EBFD883D9638E17B8E697E34756E9AE45ECAE58C94FC78CA2B352B7D0330751811BEF9F7900DC8680F87EAEE1801",
        userimage:"/image/more.png",
        title:"突发惨案：民警制止强拆，竟被城管锁喉…",
        auth:"夕阳无限好",      
      }  
    ],
    list:[],
    sharebtn:{
      sharetitle: "【点击播放】频戳中你的泪点没有？赶紧点进来看看吧！",
      shareimgurl: "/image/indexshare.png",
      sharepath: "pages/index/index"
    }   ,
  
  },
  //计数下滑次数，用在下拉追加：第二部分-------
   addzj() { return counterzj += 1; },
  
  //初始化生命周期-------------
   onLoad:function(e){
     let _this = this
     console.log(e.videourl,"进入详情页 ")
    //  接收传过来的用户播放信息
     var vid = decodeURIComponent(e.videourl)
     var img = decodeURIComponent(e.userimage)
     var title =  decodeURIComponent(e.videotitle)
     var auth = decodeURIComponent(e.auth)

     var chuangvideo


     var baseUrl = "https://vv.video.qq.com/getinfo?vids="+ vid +"&platform=101001&charge=0&otype=json"
     var baseUrls = baseUrl.replace(/\s+/g, "")

     wx.request({
       url: baseUrls,
       method: 'get',
       header: { 'Content-Type': 'application/x-www-form-urlencoded' },
       success: (res) => {
         var dataJson = res.data.replace(/QZOutputJson=/, '') + "qwe";
         var dataJson1 = dataJson.replace(/;qwe/, '');
         var data = JSON.parse(dataJson1);
         var url = data.vl.vi[0].ul.ui[0].url
         // var url2 = url.replace(/http/, "https"); //把'http'替换为https
         var fu = data.vl.vi[0].fn
         var fvkey = data.vl.vi[0].fvkey
         var a1 = url + fu + '?vkey=' + fvkey
         console.log("播放页解析得到的播放地址:" + a1)
         

         chuangvideo = [{
           videourl: a1,
           userimage: img,
           title: title,
           auth: auth,
         }]


         //有传视频信息进来才替换
            if (chuangvideo){
            _this.setData({
              video: chuangvideo
            })
            }

       },
     }) 

    

      // 请求列表数据
     wx.request({
       url: "https://www.otvllat.cn/api/Article",
       data: { lim: 6, sk: 0 },
       method: "GET",
       success: function (res) {
         // console.log(res.data)
         _this.setData({
           list: res.data
         })
       }
     });  


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

     };

      // 定时控制插屏广告
      var interval = setInterval(function () {
        var timenew = _this.data.timecpgg - 1
        _this.setData({
          timecpgg: timenew,
          cpgg: false, 
        })
        if (_this.data.timecpgg == 0) {
          _this.setData({
            cpgg: true,          //如果time的值为0时，将data里面show的值改为true,图片就可以显示了
            timecpgg: 10
          })
        }
      }, 1000)

        // 请求列表数据
     wx.request({
      url: "https://www.otvllat.cn/api/ArticleGaoxiao",
      data: { lim: 6, sk: 0 },
      method: "GET",
      success: function (res) {
        
        // console.log(res.data)
        var img =  res.data.map(item=>item.fmimage)
        // console.log(img)

        var a = Math.random();           //生成0——1的随机数
        a = a*4;                        //0——10的随机数
        a = Math.ceil(a);   
        console.log("随机生成0-4的整数"+a)
        
        _this.setData({
          checkimg: res.data[a].fmimage
        })
      }
    });  


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

     
   },
   onReady(){
     
   },
  // 重定向首页----------
  onUnload: function () {
    wx.navigateBack({
      delta: 2
    })
  },
  onShow(){
    // 在适合的场景显示插屏广告
    if (interstitialAd) {
        interstitialAd.show().catch((err) => {
          console.error(err)
        })
    }  
  },



  // 下拉到底触发函数--------------------------
  onReachBottom: function () {
      let _this =this
      // 计数下滑次数：第三部分
      var dzj = _this.addzj()
      console.log(dzj)
       
      var lim = 6
      var sk = dzj * 6

      //  1、推荐页追加    
      wx.request({
        url: "https://www.otvllat.cn/api/Article",
        data: { lim: 6, sk: sk },
        method: "GET",
        success: function (res) {
          // console.log(res.data)
          let oldlist = _this.data.list
          let newlist = res.data
          //把追加的数组连接在原数组的后面
          let addlist = oldlist.concat(newlist)
          // console.log(addlist)
          _this.setData({
            list: addlist
          })
        }
      });

    // 在适合的场景显示插屏广告
    // if (interstitialAd) {
    //     interstitialAd.show().catch((err) => {
    //       console.error(err)
    //     })  
    // }    

  },


  goDetail(e) {
    var url = e.currentTarget.dataset.videourl
    var title = e.currentTarget.dataset.videotitle
    var userimage = e.currentTarget.dataset.userimage
    var auth = e.currentTarget.dataset.auth
    var index = e.currentTarget.dataset.index


    //  点击索引为3的倍数的时候才提示跳转小程序
    if (index % 3 === 0 & index != 0){
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
          + '&userimage=' + encodeURIComponent(userimage) + '&auth=' + encodeURIComponent(auth)

      })

  }
  },
  // 右下角的按钮
  tiao(){
    wx.navigateToMiniProgram({
      appId: 'wxc75c72dd80209003',
      path: '',
      envVersion: 'release',// 打开正式版
      success(res) {
        // 打开成功
      },
      fail: function (err) {
        console.log(err);
      }
    })  
  },


  // 添加客服
  zfaddhy(){
    console.log('展开客服弹窗')
    let _this = this
    _this.setData({
      addkf: true,
    })
  },
  addkf(){
    console.log('点击添加客服')
  },
  closekf(){
    console.log("关闭客服弹窗")
    let _this = this
    _this.setData({
      addkf: false,
    })
  },


// 头部返回和通知
  back(){
    wx.navigateBack({
      delta: 2
    })
  },

  notice(){
    console.log("点击通知")
    let _this = this
    if (_this.data.duihuashow) {
      _this.setData({
        // notice是控制对话框显隐的，duihuashow:false是控制对话框出现过一次之后就不能在出现了，noticemove: 1是对话框弹出的动画
        noticemove: 1,
        notice: true,
        // duihuashow: false
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
      containermarginTop: "0rpx"
    })
  },
  

  //对话允许
  duihuayunxu(e) {
    let _this = this
    console.log('关闭对话框--允许' + e)
    _this.setData({
      noticemove: 2,
      dingyue:true
    })

    setTimeout(function () {
      _this.setData({
        dingyue: false
      })
     }, 3000);

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

  // 播放
  videoupdate(){
    // 在适合的场景显示插屏广告(初始化时定了时间，10秒一个弹窗广告)
    let _this = this
    console.log(_this.data.cpgg)
    if (interstitialAd) {
      if (_this.data.cpgg) {
        interstitialAd.show().catch((err) => {
          console.error(err)
        })
      }

    }    
  },
  playend(){
    console.log("播放结束")
    let _this = this 
    _this.setData({
      playend: true,
      videoend: true,
      myvideoback:true,
      kouzhao: false
    })
    
  },
  closeplayend(){
    let _this = this
    _this.setData({
      playend: false,
    })
  },
  gofirst(){
    wx.navigateToMiniProgram({
      appId: 'wxc75c72dd80209003',
      path: '',
      envVersion: 'release',// 打开正式版
      success(res) {
        // 打开成功
      },
      fail: function (err) {
        console.log(err);
      }
    })  
  },
  gosecond(){
    wx.navigateToMiniProgram({
      appId: 'wxc75c72dd80209003',
      path: '',
      envVersion: 'release',// 打开正式版
      success(res) {
        // 打开成功
      },
      fail: function (err) {
        console.log(err);
      }
    })  
  },
  gothird(){
    wx.navigateToMiniProgram({
      appId: 'wxc75c72dd80209003',
      path: '',
      envVersion: 'release',// 打开正式版
      success(res) {
        // 打开成功
      },
      fail: function (err) {
        console.log(err);
      }
    })  
  },


  // 重播--------------
  restartvideo(e){
    let _this = this
    console.log(e)
    //捕获当前视频
    var videoContext = wx.createVideoContext('myVideo')
    videoContext.play()

    var videourl = e.currentTarget.dataset.videourl
    var title = e.currentTarget.dataset.title
    var userimage = e.currentTarget.dataset.userimage
    var videoauth= e.currentTarget.dataset.auth

    var chuangvideo = [{
      videourl: videourl,
      userimage: userimage,
      title: title,
      auth: videoauth,
    }]

 
    //有传视频信息进来才替换
    if (chuangvideo) {
      _this.setData({
        // 替换播放的视频
        video: chuangvideo,
        
        playend:false,
        videoend: false,
        myvideoback: false,
        kouzhao: true,
      })
    }
  },

   // 下一条
  nextvideo(){
    let _this = this
    // 计数下滑次数：第三部分
    var dzj = _this.addzj()
    console.log(dzj)

    var lim = 1
    var sk = dzj * 1
    var chuangvideo
    console.log("下一条")
    // 请求列表数据
        wx.request({
          url: "https://www.otvllat.cn/api/Article",
          data: { lim: lim, sk: sk },
          method: "GET",
          success: function (res) {
            console.log(res.data)

            var vid = res.data[0].videourl
            var userimage = res.data[0].userimage
            var title = res.data[0].title
            var auth = res.data[0].auth

            var baseUrl = "https://vv.video.qq.com/getinfo?vids=" + vid + "&platform=101001&charge=0&otype=json"
            var baseUrls = baseUrl.replace(/\s+/g, "")

            wx.request({
              url: baseUrls,
              method: 'get',
              header: { 'Content-Type': 'application/x-www-form-urlencoded' },
              success: (res) => {
                var dataJson = res.data.replace(/QZOutputJson=/, '') + "qwe";
                var dataJson1 = dataJson.replace(/;qwe/, '');
                var data = JSON.parse(dataJson1);
                var url = data.vl.vi[0].ul.ui[0].url
                // var url2 = url.replace(/http/, "https"); //把'http'替换为https
                var fu = data.vl.vi[0].fn
                var fvkey = data.vl.vi[0].fvkey
                var a1 = url + fu + '?vkey=' + fvkey
                console.log("播放页解析得到的播放地址:" + a1)

                chuangvideo = [{
                  videourl: a1,
                  userimage: userimage,
                  title: title,
                  auth: auth,
                }]

                _this.setData({
                  video: chuangvideo,
                  playend: false,
                  videoend: false,
                  myvideoback: false,
                  kouzhao: true,
                })      
          }
        });   

        }
    })

  },

  kouzhao(){
    console.log("口罩")

    wx.navigateToMiniProgram({
      appId: 'wxc75c72dd80209003',
      path: '',
      envVersion: 'release',// 打开正式版
      success(res) {
        // 打开成功
      },
      fail: function (err) {
        console.log(err);
      }
    })  
  },

  gotuwen(){
    console.log("tttttttt")
    let _this = this 
    _this.tuwen()
  },



   tuwen(){
    wx.navigateToMiniProgram({
      appId: 'wxc75c72dd80209003',
      path: '',
      envVersion: 'release',// 打开正式版
      success(res) {
        // 打开成功
        console.log("打开成功")
      },
      fail: function (err) {
        console.log(err);
        console.log("打开取消")
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
    console.log(e.detail.scrollTop,"scroll")
    let top = e.detail.scrollTop
    if(top>200){
      console.log("滚动大于200rpx")
    }
  },

  scrollToTop() {
    this.setAction({
      scrollTop: 0
    })
  },


  

})