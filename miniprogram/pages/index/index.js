// 不在模块级同步 require 大型数据文件，改在 onLoad 后懒加载
Page({
  data: {
    showGenderPicker: false,
    products: [
      { id: 'handbook', icon: '📖', name: '通关手册',     teaser: '100个你不知道的细节' },
      { id: 'couple',   icon: '💑', name: '情侣通关',     teaser: '找出你们真正没对上的地方' },
      { id: 'hehun',    icon: '✨', name: '生辰婚配分析', teaser: '见家长饭桌最自然的话题' },
      { id: 'full',     icon: '🎯', name: '全套备考',     teaser: '一次全解锁，最省钱' }
    ],
    dailyCard: {},
    dailyIndex: 1,
    showPriceHint: false,
    priceHintProduct: {},

    reviews: [
      { id: 1, avatar: '🙋', name: '小红·北京', text: '第一题就问到我没想到的点，当时出了一身冷汗。答完之后心里有底多了。', tag: '做完当天顺利见完' },
      { id: 2, avatar: '👦', name: '阿杰·成都', text: '和女朋友一起做了情侣通关，发现我们婚期答案差了整整两年……', tag: '情侣通关用户' },
      { id: 3, avatar: '🌸', name: '晴晴·上海', text: '他妈妈单独叫我进房间那题，我当时没想好怎么回答，看了解析才知道。还好提前测了。', tag: '女生路径用户' },
      { id: 4, avatar: '💪', name: '大壮·广州', text: '通关手册里「壶嘴对着你是送客信号」这条，现场真的遇到了，默默转开了。', tag: '通关手册用户' }
    ]
  },

  onLoad() {
    // 首屏渲染完成后再加载大型数据
    wx.nextTick(() => {
      this._loadDailyCard()
    })
  },

  onShow() {
    wx.setNavigationBarTitle({ title: '见家长不翻车' })
  },

  _loadDailyCard() {
    // 懒加载 handbook 数据（63KB），不阻塞启动
    const { HANDBOOK_CARDS } = require('../../utils/handbook')
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    )
    const idx = Math.abs(dayOfYear) % HANDBOOK_CARDS.length
    this.setData({ dailyCard: HANDBOOK_CARDS[idx], dailyIndex: idx + 1 })
  },

  startQuiz() {
    const saved = wx.getStorageSync('userProfile')
    if (saved && saved.gender) {
      getApp().globalData.profile = saved
      wx.navigateTo({ url: '/pages/quiz/quiz' })
    } else {
      this.setData({ showGenderPicker: true })
    }
  },

  closeGenderPicker() {
    this.setData({ showGenderPicker: false })
  },

  pickGender(e) {
    const gender = e.currentTarget.dataset.val
    const profile = { gender, region: '', occasion: '', people: ['parents_only'] }
    wx.setStorageSync('userProfile', profile)
    getApp().globalData.profile = profile
    this.setData({ showGenderPicker: false })
    wx.navigateTo({ url: '/pages/quiz/quiz' })
  },

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
