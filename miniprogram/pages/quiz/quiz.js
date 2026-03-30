// questions.js (45KB) 在 onLoad 时按需加载，减少冷启动包体积
Page({
  data: {
    questions: [],
    currentIndex: 0,
    totalCount: 0,
    progressPct: 0,
    currentQ: null,
    selectedIdx: null,
    showAnalysis: false,
    openAnswer: '',
    answers: {},
    optionLabels: ['A', 'B', 'C', 'D'],

    // 知识卡
    showKnowledgeCard: false,
    currentKCard: null,

    // 情绪引爆点
    showBreakdown: false,
    breakdownShown: false,
    zeroStreak: 0,

    // 付费弹窗
    showPayModal: false,
    payProduct: null,

    gender: 'male'
  },

  onLoad() {
    const app = getApp()
    const profile = app.globalData.profile || wx.getStorageSync('userProfile') || {}
    const gender = profile.gender || 'male'

    // 在 onLoad 时 require，此时页面已切换，不影响首页启动
    const { MALE_QUESTIONS, FEMALE_QUESTIONS, KNOWLEDGE_CARDS, calcScore } = require('../../utils/questions')
    this._KNOWLEDGE_CARDS = KNOWLEDGE_CARDS
    this._calcScore = calcScore
    const questions = gender === 'male' ? MALE_QUESTIONS : FEMALE_QUESTIONS

    this.setData({
      gender,
      questions,
      totalCount: questions.length,
      currentQ: questions[0],
      progressPct: Math.round((1 / questions.length) * 100)
    })
  },

  // 用户点击某个选项（临时高亮，未确认）
  selectOption(e) {
    if (this.data.showAnalysis) return
    // data-idx 从 WXML 传来是字符串，必须转 Number，否则 === 比较永远失败
    const idx = Number(e.currentTarget.dataset.idx)
    this.setData({ selectedIdx: idx })
  },

  // 确认答案
  confirmAnswer() {
    const { currentIndex, questions, selectedIdx, answers, zeroStreak, breakdownShown } = this.data
    if (selectedIdx === null) {
      wx.showToast({ title: '请先选择一个选项', icon: 'none' })
      return
    }

    const currentQ = questions[currentIndex]
    const selectedOpt = currentQ.options[selectedIdx]
    const newAnswers = { ...answers, [currentQ.id]: selectedIdx }

    // 统计情绪引爆点：连续0分
    let newStreak = selectedOpt.score === 0 ? zeroStreak + 1 : 0

    this.setData({
      answers: newAnswers,
      showAnalysis: true,
      zeroStreak: newStreak
    })

    // 检查是否触发情绪引爆（第12题之后，连续3个0分，只触发一次）
    if (newStreak >= 3 && !breakdownShown && currentIndex >= 11) {
      setTimeout(() => {
        this.setData({ showBreakdown: true, showAnalysis: false, breakdownShown: true })
      }, 1200)
    }
  },

  // 下一题
  nextQuestion() {
    const { currentIndex, questions, answers } = this.data
    const nextIndex = currentIndex + 1

    if (nextIndex >= questions.length) {
      this._finishQuiz()
      return
    }

    const nextQ = questions[nextIndex]

    // 检查是否需要插入知识卡
    const prevQ = questions[currentIndex]
    if (prevQ.knowledgeCardAfter !== null) {
      const cardKey = `${this.data.gender === 'male' ? 'male' : 'female'}_${prevQ.knowledgeCardAfter}`
      const kcard = this._KNOWLEDGE_CARDS[cardKey]
      if (kcard) {
        this.setData({
          showKnowledgeCard: true,
          currentKCard: kcard,
          currentIndex: nextIndex,
          currentQ: nextQ,
          selectedIdx: null,
          showAnalysis: false,
          progressPct: Math.round(((nextIndex + 1) / questions.length) * 100)
        })
        return
      }
    }

    this.setData({
      currentIndex: nextIndex,
      currentQ: nextQ,
      selectedIdx: null,
      showAnalysis: false,
      progressPct: Math.round(((nextIndex + 1) / questions.length) * 100)
    })
  },

  // 关闭知识卡，继续答题
  hideKnowledgeCard() {
    this.setData({ showKnowledgeCard: false })
  },

  // 开放题输入
  onOpenInput(e) {
    this.setData({ openAnswer: e.detail.value })
  },

  // 提交开放题 → 结果页
  submitOpen() {
    const { openAnswer, answers, currentIndex, questions } = this.data
    const currentQ = questions[currentIndex]
    const newAnswers = { ...answers, [currentQ.id]: openAnswer }
    this.setData({ answers: newAnswers })
    this._finishQuiz()
  },

  // 情绪引爆点：跳去购买情侣通关
  goBuyCouple() {
    this.setData({ showBreakdown: false })
    wx.switchTab({ url: '/pages/couple/couple' })
  },

  dismissBreakdown() {
    this.setData({ showBreakdown: false, zeroStreak: 0 })
  },

  // 完成测评
  _finishQuiz() {
    const { answers, gender } = this.data
    const result = this._calcScore(answers, gender)

    // 保存结果
    const resultData = {
      gender,
      answers,
      score: result.score,
      blindSpots: result.blindSpots,
      timestamp: Date.now()
    }
    wx.setStorageSync('lastQuizResult', resultData)

    wx.redirectTo({ url: '/pages/result/result' })
  },

  goBack() {
    wx.navigateBack()
  },

  // 付费回调
  onPayClose() {
    this.setData({ showPayModal: false })
  },

  onPaySuccess(e) {
    this.setData({ showPayModal: false })
    const app = getApp()
    app.savePurchased(e.detail.key)
    wx.showToast({ title: '解锁成功', icon: 'success' })
  }
})
