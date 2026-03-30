const { scoreColor, scoreLabel, REGION_MAP } = require('../../utils/util')
const { currentYear } = require('../../utils/util')

Page({
  data: {
    score: 0,
    displayScore: 0,
    scoreColor: '#C9A96E',
    scoreLabel: '',
    gender: 'male',
    blindSpots: [],
    flippedCards: [],
    allFlipped: false,
    regionLabel: '',
    coupleResult: false,
    diffQuestions: [],
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
    const region = REGION_MAP[profile.region] || '所在'

    this._pendingResult = { score: result.score, color }

    this.setData({
      score: result.score,
      scoreColor: color,
      scoreLabel: label,
      gender: result.gender,
      blindSpots: result.blindSpots || [],
      flippedCards: new Array((result.blindSpots || []).length).fill(false),
      regionLabel: region
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
    const allFlipped = flippedCards.every(v => v)
    this.setData({ flippedCards, allFlipped })
  },

  goWecom() {
    wx.showModal({
      title: '加入私域顾问',
      content: '请复制微信号 jjz_advisor，添加顾问获取个性化建议',
      confirmText: '知道了',
      showCancel: false
    })
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
