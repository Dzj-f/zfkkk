export const baseUrl = "https://www.otvllat.cn";    //基准路径


export default function request(options){
  return new Promise((resolve,reject)=>{
    wx.request({
      url: `${baseUrl}/${options.url}`,
      method: options.method || 'get',
      data: options.data || {},
      success: resolve,
      fail: reject
    })
  })
}