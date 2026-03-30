const { scoreColor, formatDate } = require('../../utils/util')

Page({
  data: {
    purchasedItems: [],
    lastResult: null
  },

  onShow() {
    this._loadPurchased()
    this._loadLastResult()
  },

  _loadPurchased() {
    const app = getApp()
    const p = app.globalData.purchased
    const items = []

    const productMap = {
      coupleBasic: { icon: '💑', name: '情侣通关·基础版' },
      coupleFull: { icon: '💑', name: '情侣通关·完整版' },
      hehun: { icon: '✨', name: '生辰婚配分析' },
      handbook: { icon: '📖', name: '见家长通关手册' },
      fullPackage: { icon: '🎯', name: '全套备考' }
    }

    Object.entries(productMap).forEach(([key, info]) => {
      if (p[key]) {
        items.push({ key, ...info })
      }
    })

    this.setData({ purchasedItems: items })
  },

  _loadLastResult() {
    const result = wx.getStorageSync('lastQuizResult')
    if (!result) return

    const color = scoreColor(result.score)
    const timeStr = formatDate(new Date(result.timestamp))

    this.setData({
      lastResult: {
        ...result,
        scoreColor: color,
        timeStr
      }
    })
  },

  viewLastResult() {
    const result = wx.getStorageSync('lastQuizResult')
    if (result) {
      wx.navigateTo({ url: '/pages/result/result' })
    } else {
      wx.showToast({ title: '暂无测评记录', icon: 'none' })
    }
  },

  clearProfile() {
    wx.showModal({
      title: '重置画像',
      content: '将清除已保存的地区、场景等信息，下次测评需要重新选择',
      success: res => {
        if (res.confirm) {
          wx.removeStorageSync('userProfile')
          getApp().globalData.profile = null
          wx.showToast({ title: '已重置', icon: 'success' })
        }
      }
    })
  },

  showDisclaimer() {
    wx.showModal({
      title: '使用说明与声明',
      content: '本小程序提供婚恋情感类互动测评工具，帮助用户在走进对方家庭前了解双方的沟通习惯和礼仪背景。\n\n所有内容仅供参考，基于民间风俗整理，不构成专业建议。\n\n生辰婚配分析基于传统民俗文化，仅供参考。',
      confirmText: '知道了',
      showCancel: false
    })
  }
})
