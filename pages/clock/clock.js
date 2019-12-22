const app = getApp();
//星星的代码
var can;
var times=0
var stars = [];
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


const util = require('../../utils/util.js')
const defaultLogName = {
  work: '工作',
  rest: '休息'
}
const actionName = {
  stop: '停止',
  start: '开始'
}

const initDeg = {
  left: 45,
  right: -45,
}

Page({

  data: {
    remainTimeText: '',
    timerType: 'work',
    log: {},
    completed: false,
    isRuning: false,
    leftDeg: initDeg.left,
    rightDeg: initDeg.right,

    array: ['5', '10', '15', '20', '25', '35', '30', '35', '40','45','50','55','60','65','70','75','80','85','90','95','100'],
    index: 4,

    num: 60, //生成星星数量
    stars: [],  // 星星数组

    imgUrls: [
      '../../images/20190121204431.png',
      '../../images/20190121204408.png',
      '../../images/20190121204435.png',
      '../../images/20190121204440.png'
    ],
    image: '../../images/ewm.png',
    on: true   // 控制音乐的状态，以及图标是否旋转
  },

  onReady() {
    // 获取BackgroundAudioManager 实例
    this.back = wx.getBackgroundAudioManager()

    // 对实例进行设置
    if (app.globalData.positive < 0.2 && app.globalData.positive>=0)
    {
      this.back.src = "http://music.163.com/song/media/outer/url?id=468176711.mp3"
    this.back.title = 'Tassel'   // 标题为必选项
    this.back.play()               // 开始播放
    }
    if (app.globalData.positive >= 0.2 && app.globalData.positive<0.4) {
      this.back.src = "http://music.163.com/song/media/outer/url?id=531786301.mp3"
      this.back.title = 'Tassel'   // 标题为必选项
      this.back.play()               // 开始播放
    }
    if (app.globalData.positive >= 0.4 && app.globalData.positive<0.6) {
      this.back.src = "http://music.163.com/song/media/outer/url?id=1307063992.mp3"
      this.back.title = 'Tassel'   // 标题为必选项
      this.back.play()               // 开始播放
    }
    if (app.globalData.positive >= 0.6 && app.globalData.positive < 0.8) {
      this.back.src = "http://music.163.com/song/media/outer/url?id=461074907.mp3"
      this.back.title = 'Tassel'   // 标题为必选项
      this.back.play()               // 开始播放
    }
    if (app.globalData.positive >= 0.8 && app.globalData.positive <= 0.1) {
      this.back.src = "http://music.163.com/song/media/outer/url?id=539428072.mp3"
      this.back.title = 'Tassel'   // 标题为必选项
      this.back.play()               // 开始播放
    }
  },

  // 已经有好心人帮忙给出了修改，在下面给出
  stop() {
    this.back.pause(); // 点击音乐图标后出发的操作
    this.setData({ on: !this.data.on })
    if (this.data.on) {
      this.back.play()
    } else {
      this.back.pause()
    }
  },
// 修改后代, 感谢hope xu

  onShow: function() {
    if (this.data.isRuning) return
    var index = this.data.index
    var workTime = this.data.array[index]
    var restTime = this.data.array[index]
    console.log(index)
    this.setData({
      workTime: workTime,
      restTime: restTime,
      remainTimeText: workTime + ':00'
    })

    
  },

  startTimer: function(e) {

    let startTime = Date.now()
    let isRuning = this.data.isRuning
    let timerType = e.target.dataset.type
    let showTime = this.data[timerType + 'Time']
    let keepTime = showTime * 60 * 1000
    let logName = this.logName || defaultLogName[timerType]

// 卫星旋转！！！！
    this.donghua = wx.createAnimation({
      duration: 1500000000
    });
    this.donghua.rotate(100000000).step()
    this.setData({
      donghua: this.donghua.export()
    })

    if (!isRuning) {
      this.timer = setInterval((function() {
        this.updateTimer()
        this.startNameAnimation()
      }).bind(this), 1000)
    } else {
      this.stopTimer()
    }

    this.setData({
      isRuning: !isRuning,
      completed: false,
      timerType: timerType,
      remainTimeText: showTime + ':00',
      taskName: logName
    })

    this.data.log = {
      name: logName,
      startTime: Date.now(),
      keepTime: keepTime,
      endTime: keepTime + startTime,
      action: actionName[isRuning ? 'stop' : 'start'],
      type: timerType
    }

    this.saveLog(this.data.log)
    if (this.data.isRuning) return
    var index = this.data.index
    var workTime = this.data.array[index]
    var restTime = this.data.array[index]
    console.log(index)
    this.setData({
      workTime: workTime,
      restTime: restTime,
      remainTimeText: workTime + ':00'
    })
  },

  startNameAnimation: function () {
    let animation = wx.createAnimation({
      duration: 450
    })
    animation.opacity(0.2).step()
    animation.opacity(1).step()
    this.setData({
      nameAnimation: animation.export()
    })
  },

  stopTimer: function () {
    // reset circle progress
    this.setData({
      leftDeg: initDeg.left,
      rightDeg: initDeg.right
    })

    // clear timer
    this.timer && clearInterval(this.timer)
  },


  updateTimer: function() {
    let log = this.data.log
    let now = Date.now()
    let remainingTime = Math.round((log.endTime - now) / 1000)
    let H = util.formatTime(Math.floor(remainingTime / (60 * 60)) % 24, 'HH')
    let M = util.formatTime(Math.floor(remainingTime / (60)) % 60, 'MM')
    let S = util.formatTime(Math.floor(remainingTime) % 60, 'SS')
    let halfTime

    // update text
    if (remainingTime > 0) {
      let remainTimeText = (H === "00" ? "" : (H + ":")) + M + ":" + S
      this.setData({
        remainTimeText: remainTimeText
      })
    } else if (remainingTime == 0) {
      this.setData({
        completed: true
      })
      this.stopTimer()
      return
    }

    // update circle progress
    halfTime = log.keepTime / 2
    if ((remainingTime * 1000) > halfTime) {
      this.setData({
        leftDeg: initDeg.left - (180 * (now - log.startTime) / halfTime)
      })
    } else {
      this.setData({
        leftDeg: -135
      })
      this.setData({
        rightDeg: initDeg.right - (180 * (now - (log.startTime + halfTime)) / halfTime)
      })
    }
  },

  changeLogName: function(e) {
    this.logName = e.detail.value
  },

  saveLog: function(log) {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(log)
    wx.setStorageSync('logs', logs)
  },

// 卫星
  rotate: function () {
    this.donghua.rotate(100000000).step()
    this.setData({
      donghua: this.donghua.export()
    })
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


  bindTimeChange: function (e) {
    this.setData({
      index: e.detail.value
    })
    
    if (this.data.isRuning) return
    var index = this.data.index
    var workTime = this.data.array[index]
    var restTime = this.data.array[index]
    console.log(index)
    this.setData({
      workTime: workTime,
      restTime: restTime,
      remainTimeText: workTime + ':00'
    })
  },

  think:function(){
    times=times+1
   
    if (times == 1) {
      this.back.src = "https://music.163.com/song/media/outer/url?id=1395941381.mp3"
      this.back.title = 'Tassel'   // 标题为必选项
      this.back.play()               // 开始播放
      console.log(1)
    } 
    if (times == 2) {
      this.back.src = "https://music.163.com/song/media/outer/url?id=1395934977.mp3"
      this.back.title = 'Tassel'   // 标题为必选项
      this.back.play()               // 开始播放
      console.log(2)
    }
    if (times == 3) {
      this.back.src = "https://music.163.com/song/media/outer/url?id=1395942372.mp3"
      this.back.title = 'Tassel'   // 标题为必选项
      this.back.play()               // 开始播放
      console.log(3)
    }
    if (times == 4) {
      this.back.src = "https://music.163.com/song/media/outer/url?id=1385309058.mp3"
      this.back.title = 'Tassel'   // 标题为必选项
      this.back.play()               // 开始播放
      console.log(4)
    }
    if (times == 5) {
      
      this.back.src = "https://music.163.com/song/media/outer/url?id=1385105578.mp3"
      this.back.title = 'Tassel'   // 标题为必选项
      this.back.play()               // 开始播放
      console.log(5)
      
    }
    if (times == 6) {

     times=0;
      this.back.pause(); 
      console.log("归零")
    }
  }
})
