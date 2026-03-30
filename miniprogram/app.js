App({
  globalData: {
    ENV_ID: 'your-env-id',
    userInfo: null,
    profile: null,
    purchased: {
      coupleBasic: false,
      coupleFull: false,
      hehun: false,
      handbook: false,
      fullPackage: false
    }
  },

  onLaunch() {
    this._loadPurchasedStatus()
    // 云开发和更新检测放到 nextTick，不阻塞启动
    wx.nextTick(() => {
      this._initCloud()
      this._checkUpdate()
    })
  },

  _initCloud() {
    const envId = this.globalData.ENV_ID
    if (!wx.cloud || !envId || envId === 'your-env-id') return
    try {
      wx.cloud.init({ env: envId, traceUser: false })
    } catch (e) {
      // 云开发初始化失败，生辰婚配将使用本地模式
    }
  },

  _loadPurchasedStatus() {
    const purchased = wx.getStorageSync('purchased')
    if (purchased) this.globalData.purchased = purchased
  },

  savePurchased(key, value) {
    this.globalData.purchased[key] = value !== undefined ? value : true
    wx.setStorageSync('purchased', this.globalData.purchased)
  },

  isPurchased(key) {
    const p = this.globalData.purchased
    if (p.fullPackage) return true
    return !!p[key]
  },

  _checkUpdate() {
    if (!wx.canIUse('getUpdateManager')) return
    const mgr = wx.getUpdateManager()
    mgr.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已准备好，是否重启？',
        success: res => { if (res.confirm) mgr.applyUpdate() }
      })
    })
  }
})
