
//星星的代码
var can;
var stars = [];
const app= getApp()
/**定义星星 */
var starObj = function () {
  this.x;
  this.y;
  this.picNo;
  this.timer;
}
/**初始化数据 */
starObj.prototype.init = function () {
  this.x = Math.random() * 400;
  this.y = Math.random() * 600;
  this.picNo = 0;
  this.timer = 0;
}
/**生成星星 */
starObj.prototype.draw = function () {
  can.drawImage('/image/star.png', this.picNo * 7, 0, 7, 7, this.x, this.y, 7, 7);
}
/**动起来 */
starObj.prototype.undate = function () {
  this.picNo += 1;
  if (this.picNo >= 7) {
    this.picNo = 0;
  }
}
Page({
  data: {
    mood: "",
    positive: "",
    negative: "",
    modalHidden: true,
        num: 60, //生成星星数量
    stars: []  // 星星数组
  },

  yjump: function () {

    wx.navigateTo({
      url: '../clock/clock',
      success: function (res) {

      },
      fail: function (res) {

      },
      complete: function (res) {

      },
    })
   
    app.globalData.positive=this.data.positive
  },

  getMood: function (e) {

    var text = e.detail.value
    this.setData({
      mood: text
    })
    console.log(this.data.mood)
 
  },
  
  // 星星代码
  onLoad: function (options) {
    can = wx.createCanvasContext('canvas');
    /* 批量生成星星 并且初始化 */
    for (var i = 0; i < this.data.num; i++) {
      var obj = new starObj();
      stars.push(obj);
      stars[i].init();
    }
    this.gameloop(); //进行
    can.draw();
  },

  /**进行*/
  gameloop() {
    setTimeout(this.gameloop, 300);
    this.drawStars();
  },
  /**生成动起来 **/
  drawStars() {
    for (var i = 0; i < this.data.num; i++) {
      stars[i].undate();
      stars[i].draw();
    }
    can.draw();
  },
 
  switchModal: function () {
    this.setData({
      modalHidden: !this.data.modalHidden
    })
  },



  get: function (e) {
    var that = this;
    var mood = this.data.mood;
    var access_token = that.data.access_token;
    this.setData({
      modalHidden: !this.data.modalHidden
    })
  

    wx.request({
      url: 'https://aip.baidubce.com/rpc/2.0/nlp/v1/sentiment_classify_custom?access_token=' + access_token,
      method: 'POST',
      data: {
        text: mood,
      },
      header: {
        'Content-Type': 'application/json',

      },
      success: function (res) {
        console.log(res.data) //可以看到返回的json格式数据
        var pos = res.data.items[0].positive_prob
        var neg = res.data.items[0].negative_prob
        that.setData({
          positive: pos,
          negative: neg
        })
      }
    })

  },
  upload: function () {
    var that = this;
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=I6MNb7sw7C7bSeImDQtj6SSP&client_secret=rMhvCFx3x5YBW7stx8rm0QMwprt28OFA&',
      method: 'post',
      success: function (res) {
        console.log(res.data.access_token) //可以看到返回的json格式数据
        that.setData({ access_token: res.data.access_token })
      }
    })
  },





})
