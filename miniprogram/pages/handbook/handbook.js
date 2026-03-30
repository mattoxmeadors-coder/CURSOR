const { HANDBOOK_CARDS } = require('../../utils/handbook')

const ALL_CATEGORIES = ['全部', ...new Set(HANDBOOK_CARDS.map(c => c.category))]

Page({
  data: {
    categories: ALL_CATEGORIES,
    activeCategory: '全部',
    filteredCards: [],
    expandedId: null,
    isUnlocked: false,
    showPaywall: false,
    showPayModal: false,
    payProduct: null
  },

  onLoad() {
    this._checkUnlocked()
    this._filterCards('全部')
  },

  onShow() {
    this._checkUnlocked()
  },

  _checkUnlocked() {
    const app = getApp()
    const unlocked = app.isPurchased('handbook') || app.isPurchased('fullPackage')
    this.setData({ isUnlocked: unlocked })
  },

  _filterCards(category) {
    const cards = category === '全部'
      ? HANDBOOK_CARDS
      : HANDBOOK_CARDS.filter(c => c.category === category)
    this.setData({ filteredCards: cards })
  },

  filterCategory(e) {
    const cat = e.currentTarget.dataset.cat
    this.setData({ activeCategory: cat, expandedId: null })
    this._filterCards(cat)
  },

  toggleCard(e) {
    const { id, free } = e.currentTarget.dataset
    const { expandedId, isUnlocked } = this.data

    if (expandedId === id) {
      this.setData({ expandedId: null, showPaywall: false })
      return
    }

    this.setData({ expandedId: id })

    // 检查是否是第20条之后的付费内容
    if (id > 20 && !isUnlocked && !free) {
      this.setData({ showPaywall: true })
    }
  },

  unlockAll() {
    const app = getApp()
    if (app.isPurchased('handbook') || app.isPurchased('fullPackage')) {
      this.setData({ isUnlocked: true })
      return
    }
    this.setData({
      showPayModal: true,
      payProduct: {
        key: 'handbook',
        name: '见家长通关手册',
        desc: '100道知识卡，前20条免费，¥4.9解锁全部80条',
        price: '4.9',
        originalPrice: null
      }
    })
  },

  goWecom() {
    wx.showModal({
      title: '联系顾问',
      content: '复制微信号 jjz_advisor，加入私域获取个性化礼品推荐',
      confirmText: '知道了',
      showCancel: false
    })
  },

  onPayClose() {
    this.setData({ showPayModal: false })
  },

  onPaySuccess(e) {
    const app = getApp()
    app.savePurchased(e.detail.key)
    this.setData({
      showPayModal: false,
      isUnlocked: true,
      showPaywall: false
    })
    wx.showToast({ title: '解锁成功！', icon: 'success' })
  }
})
