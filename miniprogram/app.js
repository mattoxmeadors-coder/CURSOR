// app.js
App({
  globalData: {
    // 云开发环境ID，上线前替换
    ENV_ID: 'your-env-id',
    userInfo: null,
    // 用户画像（4步选择结果）
    profile: null,
    // 付费状态
    purchased: {
      coupleBasic: false,
      coupleFull: false,
      hehun: false,
      handbook: false,
      fullPackage: false,
      regions: {} // { 'shandong': true, ... }
    }
  },

  onLaunch() {
    // 先做本地数据，云开发延迟到真正需要时再初始化（加快首屏速度）
    this._loadPurchasedStatus()
    // 非阻塞：延迟初始化云开发，且只在有真实envId时才初始化
    setTimeout(() => {
      const envId = this.globalData.ENV_ID
      if (wx.cloud && envId && envId !== 'your-env-id') {
        try {
          wx.cloud.init({ env: envId, traceUser: false })
        } catch (e) {
          console.warn('云开发初始化失败，生辰婚配功能将使用本地模式', e)
        }
      }
      this._checkUpdate()
    }, 100)
  },

  _loadPurchasedStatus() {
    const purchased = wx.getStorageSync('purchased')
    if (purchased) {
      this.globalData.purchased = purchased
    }
  },

  savePurchased(key, value = true) {
    this.globalData.purchased[key] = value
    wx.setStorageSync('purchased', this.globalData.purchased)
  },

  isPurchased(key) {
    const p = this.globalData.purchased
    if (p.fullPackage) return true
    return !!p[key]
  },

  _checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: res => {
            if (res.confirm) updateManager.applyUpdate()
          }
        })
      })
    }
  }
})
