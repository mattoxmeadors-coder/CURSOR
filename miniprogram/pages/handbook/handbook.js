// handbook.js — 懒加载大型数据，避免影响冷启动
// HANDBOOK_CARDS (63KB) 在 onLoad 后才 require，不在模块顶层
Page({
  data: {
    categories: ['全部'],   // 初始只有"全部"，onLoad后动态填入
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
    // 懒加载：首帧渲染完后再加载63KB数据
    wx.nextTick(() => {
      const { HANDBOOK_CARDS } = require('../../utils/handbook')
      this._handbookCards = HANDBOOK_CARDS
      const cats = ['全部', ...new Set(HANDBOOK_CARDS.map(c => c.category))]
      this.setData({
        categories: cats,
        filteredCards: HANDBOOK_CARDS
      })
    })
  },

  onShow() {
    this._checkUnlocked()
  },

  _checkUnlocked() {
    const app = getApp()
    this.setData({ isUnlocked: app.isPurchased('handbook') || app.isPurchased('fullPackage') })
  },

  _filterCards(category) {
    const cards = this._handbookCards || []
    this.setData({
      filteredCards: category === '全部' ? cards : cards.filter(c => c.category === category)
    })
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
    if (id > 20 && !isUnlocked && !free) {
      this.setData({ showPaywall: true })
    }
  },

  unlockAll() {
    const app = getApp()
    if (app.isPurchased('handbook') || app.isPurchased('fullPackage')) {
      this.setData({ isUnlocked: true, showPaywall: false })
      return
    }
    this.setData({
      showPayModal: true,
      payProduct: { key: 'handbook', name: '见家长通关手册', desc: '100道知识卡，前20条免费，¥4.9解锁全部80条', price: '4.9', originalPrice: null }
    })
  },

  goWecom() {
    wx.showModal({ title: '联系顾问', content: '复制微信号 jjz_advisor，加入私域获取个性化礼品推荐', confirmText: '知道了', showCancel: false })
  },

  onPayClose() {
    this.setData({ showPayModal: false })
  },

  onPaySuccess(e) {
    getApp().savePurchased(e.detail.key)
    this.setData({ showPayModal: false, isUnlocked: true, showPaywall: false })
    wx.showToast({ title: '解锁成功！', icon: 'success' })
  }
})
