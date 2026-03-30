const { scoreColor, scoreLabel, REGION_MAP } = require('../../utils/util')

Page({
  data: {
    score: 0,
    displayScore: 0,
    scoreColor: '#C9A96E',
    scoreLabel: '',
    gender: 'male',
    blindSpots: [],
    flippedCards: [],
    flippedCount: 0,
    regionLabel: '',
    giftTitle: '',
    giftQuestion: '',
    giftBody: '',
    showPayModal: false,
    payProduct: null
  },

  onLoad() {
    const result = wx.getStorageSync('lastQuizResult')
    if (!result) {
      wx.navigateBack()
      return
    }

    const profile = wx.getStorageSync('userProfile') || {}
    const color = scoreColor(result.score)
    const label = scoreLabel(result.score)
    const region = REGION_MAP[profile.region]
    const gender = result.gender

    // 礼品屏动态文案：有地区用地区，没有地区用性别给通用建议
    let giftTitle, giftQuestion, giftBody
    if (region) {
      giftTitle = region + '的家庭'
      giftQuestion = '带什么礼物最不会踩雷？'
      giftBody = '顾问根据你的地区和家庭类型，推荐3件不踩雷的礼物，含理由和预算范围。'
    } else if (gender === 'male') {
      giftTitle = '第一次去女方家'
      giftQuestion = '礼物怎么选才不显得没用心？'
      giftBody = '父亲和母亲的礼物要分开选，搭配逻辑、预算区间、哪些绝对别带——告诉顾问你的具体情况，他来帮你定方案。'
    } else {
      giftTitle = '第一次去男方家'
      giftQuestion = '带什么，她妈妈才真的觉得你用心了？'
      giftBody = '礼物的上限是4样，其中必须有一样单独为他妈妈选的。告诉顾问你的情况，推荐具体方案。'
    }

    this._pendingResult = { score: result.score, color }

    this.setData({
      score: result.score,
      scoreColor: color,
      scoreLabel: label,
      gender,
      blindSpots: result.blindSpots || [],
      flippedCards: new Array((result.blindSpots || []).length).fill(false),
      regionLabel: region || '',
      giftTitle,
      giftQuestion,
      giftBody
    })
  },

  onReady() {
    if (this._pendingResult) {
      const { score, color } = this._pendingResult
      this._animateScore(score)
      this._drawScoreRing(score, color)
    }
  },

  // 分数计数动画
  _animateScore(target) {
    let current = 0
    const step = Math.ceil(target / 40)
    const timer = setInterval(() => {
      current = Math.min(current + step, target)
      this.setData({ displayScore: current })
      if (current >= target) clearInterval(timer)
    }, 30)
  },

  // Canvas绘制进度环
  _drawScoreRing(score, color) {
    const query = wx.createSelectorQuery()
    query.select('#scoreCanvas').fields({ node: true, size: true }).exec(res => {
      if (!res[0] || !res[0].node) return
      const canvas = res[0].node
      const dpr = wx.getSystemInfoSync().pixelRatio
      const w = res[0].width * dpr
      const h = res[0].height * dpr
      canvas.width = w
      canvas.height = h

      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)

      const cx = res[0].width / 2
      const cy = res[0].height / 2
      const r = cx - 16
      const startAngle = -Math.PI / 2
      const endAngle = startAngle + (score / 100) * Math.PI * 2

      // 背景弧
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = '#2A2A2A'
      ctx.lineWidth = 16
      ctx.stroke()

      // 彩色弧（带动画）
      let current = 0
      const animate = () => {
        ctx.clearRect(0, 0, res[0].width, res[0].height)

        // 背景弧
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = '#2A2A2A'
        ctx.lineWidth = 16
        ctx.lineCap = 'round'
        ctx.stroke()

        // 进度弧
        current = Math.min(current + 3, score)
        const curEnd = startAngle + (current / 100) * Math.PI * 2

        ctx.beginPath()
        ctx.arc(cx, cy, r, startAngle, curEnd)
        ctx.strokeStyle = color
        ctx.lineWidth = 16
        ctx.lineCap = 'round'
        ctx.stroke()

        if (current < score) {
          canvas.requestAnimationFrame(animate)
        }
      }
      canvas.requestAnimationFrame(animate)
    })
  },

  // 翻牌
  flipCard(e) {
    const idx = e.currentTarget.dataset.idx
    const flippedCards = [...this.data.flippedCards]
    flippedCards[idx] = true
    const flippedCount = flippedCards.filter(v => v).length
    this.setData({ flippedCards, flippedCount })
  },

  saveShareCard() {
    wx.showToast({ title: '长按图片保存', icon: 'none' })
  },

  // 合规引流：打开客服会话（微信审核允许，不直接展示微信号）
  openCustomerService() {
    wx.openCustomerServiceChat({
      extInfo: { url: 'https://work.weixin.qq.com/kfid/your-kf-id' },
      corpId: 'your-corp-id',
      success() {},
      fail() {
        // 降级：引导用户搜索公众号
        wx.showModal({
          title: '联系顾问',
          content: '搜索公众号「见家长不翻车」→ 发送「盲区」，顾问会在1小时内回复你',
          confirmText: '知道了',
          showCancel: false
        })
      }
    })
  },

  copyServiceHint() {
    wx.setClipboardData({
      data: '盲区',
      success() {
        wx.showToast({ title: '已复制，打开对话后粘贴发送', icon: 'success' })
      }
    })
  },

  onContactTap() {
    // open-type="contact" 触发后的回调，可做埋点
  },

  goWecom() {
    this.openCustomerService()
  },

  goCouple() {
    wx.switchTab({ url: '/pages/couple/couple' })
  },

  redoQuiz() {
    wx.redirectTo({ url: '/pages/quiz/quiz' })
  },

  onPayClose() {
    this.setData({ showPayModal: false })
  },

  onPaySuccess(e) {
    this.setData({ showPayModal: false })
    const app = getApp()
    app.savePurchased(e.detail.key)
  }
})
