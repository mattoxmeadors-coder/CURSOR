Page({
  data: {
    pageState: 'input', // input / loading / report
    myBirthday: '',
    myCalType: 'solar',
    myGender: 'male',
    taBirthday: '',
    taCalType: 'solar',
    taGender: 'female',
    report: null,
    reminderDate: '',
    showPayModal: false,
    payProduct: null
  },

  onLoad(options) {
    if (options.showBuy) {
      this._showBuyModal(options.showBuy)
    }
    // 检查已有缓存报告
    const cached = wx.getStorageSync('hehunReport')
    if (cached) {
      this.setData({ report: cached, pageState: 'report' })
    }
  },

  setCalType(e) {
    const { who, type } = e.currentTarget.dataset
    if (who === 'my') this.setData({ myCalType: type })
    else this.setData({ taCalType: type })
  },

  setGender(e) {
    const { who, g } = e.currentTarget.dataset
    if (who === 'my') this.setData({ myGender: g })
    else this.setData({ taGender: g })
  },

  onMyBirthdayChange(e) {
    this.setData({ myBirthday: e.detail.value })
  },

  resetMyBirthday() {
    this.setData({ myBirthday: '' })
  },

  onTaBirthdayChange(e) {
    this.setData({ taBirthday: e.detail.value })
  },

  resetTaBirthday() {
    this.setData({ taBirthday: '' })
  },

  // 简版免费报告
  generateFreeReport() {
    const { myBirthday, taBirthday } = this.data
    if (!myBirthday || !taBirthday) {
      wx.showToast({ title: '请先填写双方生辰', icon: 'none' }); return
    }
    const score = 60 + Math.floor(Math.random() * 35)
    const summaries = [
      '五行相生，感情基础稳固，相处有天然默契',
      '五行互补，各有所长，用心经营会越来越好',
      '个性互补，一动一静，是很好的组合',
      '感情线稳，有一起走远的基础'
    ]
    const summary = summaries[Math.floor(Math.random() * summaries.length)]
    wx.showModal({
      title: `婚配指数：${score}分`,
      content: `${summary}\n\n解锁完整报告（¥6.9）可查看：\n四柱八字 · 五行分析 · 四维契合度\n三大优势 · 两个挑战 · 饭桌话题锦囊`,
      confirmText: '解锁完整版',
      cancelText: '暂不',
      success: res => {
        if (res.confirm) this._showBuyModal('hehun')
      }
    })
  },

  generateReport() {
    const { myBirthday, taBirthday } = this.data
    if (!myBirthday || !taBirthday) {
      wx.showToast({ title: '请填写双方生辰', icon: 'none' })
      return
    }

    const app = getApp()
    if (!app.isPurchased('hehun') && !app.isPurchased('fullPackage')) {
      this._showBuyModal('hehun')
      return
    }

    this._callDeepSeek()
  },

  _callDeepSeek() {
    this.setData({ pageState: 'loading' })
    const { myBirthday, myCalType, myGender, taBirthday, taCalType, taGender } = this.data

    // 如果没有配置云开发，直接走本地降级
    const app = getApp()
    const hasCloud = wx.cloud && app.globalData.ENV_ID && app.globalData.ENV_ID !== 'your-env-id'

    if (!hasCloud) {
      const mockReport = this._generateMockReport()
      wx.setStorageSync('hehunReport', mockReport)
      setTimeout(() => {
        this.setData({ report: mockReport, pageState: 'report' })
      }, 1500) // 模拟加载感
      return
    }

    wx.cloud.callFunction({
      name: 'heHun',
      data: { myBirthday, myCalType, myGender, taBirthday, taCalType, taGender },
      success: res => {
        const report = res.result
        wx.setStorageSync('hehunReport', report)
        this.setData({ report, pageState: 'report' })
      },
      fail: () => {
        const mockReport = this._generateMockReport()
        wx.setStorageSync('hehunReport', mockReport)
        this.setData({ report: mockReport, pageState: 'report' })
      }
    })
  },

  // 降级本地报告（云函数不可用时）
  _generateMockReport() {
    const { myBirthday, myGender, taBirthday, taGender } = this.data
    const myYear = parseInt(myBirthday.split('-')[0])
    const taYear = parseInt(taBirthday.split('-')[0])
    const ageDiff = Math.abs(myYear - taYear)

    const indexScore = 70 + Math.floor(Math.random() * 25)

    return {
      index: indexScore,
      summary: indexScore >= 85
        ? '五行相生，感情基础稳固，相处有天然的默契感'
        : indexScore >= 70
        ? '五行互补，各有所长，需要在沟通方式上多一些耐心'
        : '有挑战也有机遇，用心经营会越来越好',
      bazi: [
        { pillar: '年柱', gan: '甲', zhi: '子' },
        { pillar: '月柱', gan: '丙', zhi: '午' },
        { pillar: '日柱', gan: '戊', zhi: '寅' },
        { pillar: '时柱', gan: '壬', zhi: '申' }
      ],
      wuxing: `你：木火较旺，性格热情主动，决断力强。
TA：金水较旺，性格沉稳内敛，执行力强。
两人五行互补，一个擅长开创，一个擅长落实，分工自然形成。`,
      dimensions: [
        { name: '情感', score: Math.min(indexScore + 8, 98) },
        { name: '沟通', score: Math.max(indexScore - 5, 60) },
        { name: '发展', score: Math.min(indexScore + 3, 95) },
        { name: '家庭', score: Math.max(indexScore - 2, 65) }
      ],
      advantages: [
        '你们一个善于开创局面，一个善于稳定推进，做事有天然的互补节奏',
        '感情上主动方和接受方角色清晰，不容易陷入"两个人都在等对方先说"的僵局',
        '在家庭决策上，一人偏感性一人偏理性，能互相制衡，不容易走极端'
      ],
      challenges: [
        {
          title: '沟通节奏差异：你说话快，TA思考慢，容易被误解为"不在乎"',
          suggest: '给TA一点缓冲时间，"你想清楚了我们再聊"会比"你怎么不说话"有效得多'
        },
        {
          title: '压力处理方式不同：一个对外说，一个往内压',
          suggest: '约定一个"解压时间"，不用每次都互相解决，但要让对方知道你在压着什么'
        }
      ],
      tableTopic: `见家长当天，你可以自然地说：\n"我们之前用了一个工具分析了一下生辰，说我们五行挺互补的——我比较急，TA比较稳，正好。"\n父母会对这种主动展示"互相了解"的方式印象深刻。`,
      nearYears: '2025年、2026年是两人关系发展的好时机，适合推进重要节点。',
      lastWord: `你们是互补型的一对。\n不需要变成同一种人，\n只需要在对方最软的地方，站稳。`
    }
  },

  resetForm() {
    wx.removeStorageSync('hehunReport')
    this.setData({
      pageState: 'input',
      myBirthday: '',
      taBirthday: '',
      myCalType: 'solar',
      taCalType: 'solar',
      myGender: 'male',
      taGender: 'female',
      report: null
    })
  },

  onReminderDateChange(e) {
    this.setData({ reminderDate: e.detail.value })
  },

  setReminder() {
    const { reminderDate, report } = this.data
    if (!reminderDate) {
      wx.showToast({ title: '请先选择日期', icon: 'none' })
      return
    }
    // 订阅消息提醒
    wx.requestSubscribeMessage({
      tmplIds: ['your-template-id'],
      success: () => {
        wx.showToast({ title: `已设置 ${reminderDate} 提醒`, icon: 'success' })
        wx.setStorageSync('hehunReminder', { date: reminderDate, report: report?.summary })
      },
      fail: () => {
        wx.showToast({ title: '提醒设置失败，请授权通知', icon: 'none' })
      }
    })
  },

  _showBuyModal(key = 'hehun') {
    this.setData({
      showPayModal: true,
      payProduct: {
        key: key === 'fullPackage' ? 'fullPackage' : 'hehun',
        name: key === 'fullPackage' ? '全套备考' : '生辰婚配分析·完整版',
        desc: key === 'fullPackage'
          ? '情侣完整版+完整手册+完整婚配报告\n分开买¥16.7，全套¥12.9'
          : '9个维度完整报告+饭桌话题锦囊+当天提醒',
        price: key === 'fullPackage' ? '12.9' : '6.9',
        originalPrice: key === 'fullPackage' ? '16.7' : null
      }
    })
  },

  onPayClose() {
    this.setData({ showPayModal: false })
  },

  onPaySuccess(e) {
    const app = getApp()
    app.savePurchased(e.detail.key)
    this.setData({ showPayModal: false })
    wx.showToast({ title: '支付成功', icon: 'success' })
    setTimeout(() => this._callDeepSeek(), 500)
  }
})
