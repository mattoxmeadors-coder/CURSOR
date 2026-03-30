Component({
  properties: {
    show: { type: Boolean, value: false },
    product: { type: Object, value: {} }
  },

  data: {
    showUpgrade: false,
    showDiffUpgrade: false
  },

  observers: {
    'product': function (product) {
      if (!product) return
      const key = product.key || ''
      // 非全套本身，才显示全套升级提示
      const showUpgrade = key !== 'fullPackage' && key !== 'hehun' // 避免循环
      // 基础版才显示差价升级
      const showDiffUpgrade = key === 'coupleFull'
      this.setData({ showUpgrade, showDiffUpgrade })
    }
  },

  methods: {
    onClose() {
      this.triggerEvent('close')
    },

    onPay() {
      const { product } = this.properties
      // 真实环境：调用微信支付
      // 开发/测试环境：直接模拟成功
      wx.showLoading({ title: '支付中…' })
      setTimeout(() => {
        wx.hideLoading()
        this.triggerEvent('pay', { key: product.key, price: product.price })
      }, 800)
    },

    buyFullPackage() {
      this.triggerEvent('close')
      // 让父页面处理全套购买
      this.triggerEvent('pay', { key: 'fullPackage', price: '29.9' })
    },

    diffUpgrade() {
      const { product } = this.properties
      // 差价升级
      this.triggerEvent('pay', { key: 'coupleFull', price: '10', isDiffUpgrade: true })
    }
  }
})
