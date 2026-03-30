const { HANDBOOK_CARDS } = require('../../utils/handbook')

Page({
  data: {
    // 性别选择遮罩
    showGenderPicker: false,

    // 产品卡
    products: [
      { id: 'handbook', icon: '📖', name: '通关手册',     teaser: '100个你不知道的细节' },
      { id: 'couple',   icon: '💑', name: '情侣通关',     teaser: '找出你们真正没对上的地方' },
      { id: 'hehun',    icon: '✨', name: '生辰婚配分析', teaser: '见家长饭桌最自然的话题' },
      { id: 'full',     icon: '🎯', name: '全套备考',     teaser: '一次全解锁，最省钱' }
    ],

    dailyCard: {},
    dailyIndex: 1,

    // 价格弹层
    showPriceHint: false,
    priceHintProduct: {}
  },

  onLoad() {
    setTimeout(() => this._loadDailyCard(), 50)
  },

  onShow() {
    wx.setNavigationBarTitle({ title: '见家长' })
  },

  _loadDailyCard() {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    )
    const idx = Math.abs(dayOfYear) % HANDBOOK_CARDS.length
    this.setData({ dailyCard: HANDBOOK_CARDS[idx], dailyIndex: idx + 1 })
  },

  // ─── 开始测评 ───
  startQuiz() {
    const saved = wx.getStorageSync('userProfile')
    if (saved && saved.gender) {
      // 已有性别，直接进
      getApp().globalData.profile = saved
      wx.navigateTo({ url: '/pages/quiz/quiz' })
    } else {
      // 弹出性别选择
      this.setData({ showGenderPicker: true })
    }
  },

  closeGenderPicker() {
    this.setData({ showGenderPicker: false })
  },

  // 选完性别，立刻进测评
  pickGender(e) {
    const gender = e.currentTarget.dataset.val
    const profile = { gender, region: '', occasion: '', people: ['parents_only'] }
    wx.setStorageSync('userProfile', profile)
    getApp().globalData.profile = profile
    this.setData({ showGenderPicker: false })
    wx.navigateTo({ url: '/pages/quiz/quiz' })
  },

  // ─── 产品卡 ───
  onProductTap(e) {
    const id = e.currentTarget.dataset.id
    const priceMap = {
      handbook: { icon: '📖', name: '通关手册',     free: '前20条免费',  paid: '全部100条 ¥4.9',  route: 'handbook' },
      couple:   { icon: '💑', name: '情侣通关',     free: '发起免费',    paid: '完整42题 ¥4.9',   route: 'couple' },
      hehun:    { icon: '✨', name: '生辰婚配分析', free: '简版免费',    paid: '完整报告 ¥6.9',   route: 'hehun' },
      full:     { icon: '🎯', name: '全套备考',     free: null,          paid: '全部解锁 ¥12.9',  route: null,
                  desc: '情侣完整版+完整手册+完整婚配报告\n分开买 ¥16.7，全套省 ¥3.8' }
    }
    this.setData({ showPriceHint: true, priceHintProduct: priceMap[id] || {} })
  },

  closePriceHint() {
    this.setData({ showPriceHint: false })
  },

  noop() {},

  goProductFree() {
    const { priceHintProduct } = this.data
    this.setData({ showPriceHint: false })
    this._routeTo(priceHintProduct.route)
  },

  goProductPaid() {
    const { priceHintProduct } = this.data
    this.setData({ showPriceHint: false })
    this._routeTo(priceHintProduct.route, true)
  },

  _routeTo(route, paid) {
    if (!route) { wx.navigateTo({ url: '/pages/hehun/hehun?showBuy=fullPackage' }); return }
    if (route === 'handbook') { wx.switchTab({ url: '/pages/handbook/handbook' }); return }
    if (route === 'couple')   { wx.switchTab({ url: '/pages/couple/couple' }); return }
    if (route === 'hehun')    { wx.navigateTo({ url: '/pages/hehun/hehun' + (paid ? '?showBuy=hehun' : '') }); return }
  },

  goHandbook() { wx.switchTab({ url: '/pages/handbook/handbook' }) },
  goCouple()   { wx.switchTab({ url: '/pages/couple/couple' }) },
  goHehun()    { wx.navigateTo({ url: '/pages/hehun/hehun' }) }
})
