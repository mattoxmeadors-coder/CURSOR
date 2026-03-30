const { HANDBOOK_CARDS } = require('../../utils/handbook')

Page({
  data: {
    showProfile: false,
    profileStep: 1,
    profile: {
      gender: '',
      region: '',
      occasion: '',
      people: []
    },
    // 步骤4：用 peopleSelected 对象代替 indexOf（WXML不支持Array.indexOf）
    peopleSelected: {},

    regions: [
      { value: 'north',     label: '华北·山东·河南',    tag: '礼数严格，规矩多' },
      { value: 'northeast', label: '东北三省',           tag: '酒桌文化强，亲戚多' },
      { value: 'northwest', label: '西北·陕甘宁',        tag: '传统习俗，重视礼节' },
      { value: 'jiangzhe',  label: '江浙沪·杭州',        tag: '生活品质导向，相对开明' },
      { value: 'central',   label: '华中·湖南湖北安徽',  tag: '中等习俗，家庭差异大' },
      { value: 'southwest', label: '西南·四川重庆',      tag: '热情随和，相对轻松' },
      { value: 'guangdong', label: '两广·华南',          tag: '务实，粤语地区有特定礼节' },
      { value: 'chaoshan',  label: '潮汕·闽南',          tag: '习俗最复杂，规矩最多' },
      { value: 'firsttier', label: '北上广深·一线城区',  tag: '习俗淡化，以个人风格为主' }
    ],
    occasions: [
      { value: 'first',   label: '初次登门', desc: '第一次走进这个家门，互相认识' },
      { value: 'formal',  label: '正式相见', desc: '见过几面了，这次认真来谈的' },
      { value: 'wedding', label: '婚事考察', desc: '两家人开始讨论婚事的可能性' },
      { value: 'holiday', label: '节日走动', desc: '已是常来的关系，节日礼数上门' },
      { value: 'engage',  label: '准备订亲', desc: '双方已确认，来定具体事宜' }
    ],
    peopleOptions: [
      { value: 'parents_only',  label: '只有对方父母两人',          warn: '' },
      { value: 'grandparents',  label: '有爷爷奶奶/外公外婆',       warn: '需额外准备礼物和问候' },
      { value: 'siblings',      label: '有成年兄弟姐妹',            warn: '' },
      { value: 'kids',          label: '有未成年小孩',              warn: '需要准备见面红包' },
      { value: 'relatives',     label: '临时有亲戚在场',            warn: '' },
      { value: 'neighbors',     label: '可能遇到父母的朋友或邻居',  warn: '' }
    ],

    // 产品卡片（隐藏价格版，用户点击后才弹出）
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
    priceHintProduct: null
  },

  onLoad() {
    // 异步加载日卡，不阻塞首屏
    setTimeout(() => this._loadDailyCard(), 50)
    this._loadSavedProfile()
  },

  onShow() {
    wx.setNavigationBarTitle({ title: '见家长' })
  },

  _loadDailyCard() {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
    )
    const idx = dayOfYear % HANDBOOK_CARDS.length
    this.setData({ dailyCard: HANDBOOK_CARDS[idx], dailyIndex: idx + 1 })
  },

  _loadSavedProfile() {
    const saved = wx.getStorageSync('userProfile')
    if (saved) {
      const peopleSelected = {}
      ;(saved.people || []).forEach(v => { peopleSelected[v] = true })
      this.setData({ profile: saved, peopleSelected })
    }
  },

  // ─── 产品卡点击：先展示价格说明，再引导进入 ───
  onProductTap(e) {
    const id = e.currentTarget.dataset.id
    const priceMap = {
      handbook: { name: '通关手册',     free: '前20条免费',  paid: '全部100条 ¥4.9',   route: 'handbook' },
      couple:   { name: '情侣通关',     free: '发起免费',    paid: '完整42题 ¥4.9',    route: 'couple' },
      hehun:    { name: '生辰婚配分析', free: '简版免费',    paid: '完整报告 ¥6.9',    route: 'hehun' },
      full:     { name: '全套备考',     free: null,          paid: '全部解锁 ¥12.9',   route: null,
                  desc: '情侣完整版+完整手册+完整婚配报告\n分开买 ¥16.7，全套省 ¥3.8' }
    }
    this.setData({ showPriceHint: true, priceHintProduct: { id, ...priceMap[id] } })
  },

  closePriceHint() {
    this.setData({ showPriceHint: false })
  },

  goProductFree() {
    const { priceHintProduct } = this.data
    this.setData({ showPriceHint: false })
    this._routeToProduct(priceHintProduct.route)
  },

  goProductPaid() {
    const { priceHintProduct } = this.data
    this.setData({ showPriceHint: false })
    this._routeToProduct(priceHintProduct.route, true)
  },

  _routeToProduct(route, paid = false) {
    if (!route) {
      // 全套备考直接弹支付
      wx.navigateTo({ url: '/pages/hehun/hehun?showBuy=fullPackage' })
      return
    }
    if (route === 'handbook') { wx.switchTab({ url: '/pages/handbook/handbook' }); return }
    if (route === 'couple')   { wx.switchTab({ url: '/pages/couple/couple' }); return }
    if (route === 'hehun')    { wx.navigateTo({ url: '/pages/hehun/hehun' + (paid ? '?showBuy=hehun' : '') }); return }
  },

  // ─── 开始测评 ───
  startQuiz() {
    const app = getApp()
    if (app.globalData.profile) {
      wx.navigateTo({ url: '/pages/quiz/quiz' })
    } else {
      this.setData({ showProfile: true, profileStep: 1 })
    }
  },

  closeProfile() {
    this.setData({ showProfile: false })
  },

  // 步骤1
  selectGender(e) {
    this.setData({ 'profile.gender': e.currentTarget.dataset.val })
  },

  // 步骤2
  selectRegion(e) {
    this.setData({ 'profile.region': e.currentTarget.dataset.val })
  },

  // 步骤3
  selectOccasion(e) {
    this.setData({ 'profile.occasion': e.currentTarget.dataset.val })
  },

  // 步骤4：用 peopleSelected 对象，避免 indexOf
  togglePeople(e) {
    const val = e.currentTarget.dataset.val
    const peopleSelected = Object.assign({}, this.data.peopleSelected)
    if (peopleSelected[val]) {
      delete peopleSelected[val]
    } else {
      peopleSelected[val] = true
    }
    const people = Object.keys(peopleSelected)
    this.setData({ peopleSelected, 'profile.people': people })
  },

  nextStep() {
    const { profileStep, profile } = this.data
    if (profileStep === 1 && !profile.gender) {
      wx.showToast({ title: '请选择性别', icon: 'none' }); return
    }
    if (profileStep === 2 && !profile.region) {
      wx.showToast({ title: '请选择地区', icon: 'none' }); return
    }
    if (profileStep === 3 && !profile.occasion) {
      wx.showToast({ title: '请选择见面性质', icon: 'none' }); return
    }
    if (profileStep < 4) {
      this.setData({ profileStep: profileStep + 1 })
      return
    }
    // 步骤4完成
    let people = Object.keys(this.data.peopleSelected)
    if (people.length === 0) people = ['parents_only']
    const finalProfile = { ...profile, people }
    wx.setStorageSync('userProfile', finalProfile)
    getApp().globalData.profile = finalProfile
    this.setData({ showProfile: false })
    wx.navigateTo({ url: '/pages/quiz/quiz' })
  },

  prevStep() {
    const { profileStep } = this.data
    if (profileStep > 1) this.setData({ profileStep: profileStep - 1 })
  },

  goHandbook() { wx.switchTab({ url: '/pages/handbook/handbook' }) },
  goCouple()   { wx.switchTab({ url: '/pages/couple/couple' }) },
  goHehun()    { wx.navigateTo({ url: '/pages/hehun/hehun' }) }
})
