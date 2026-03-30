const { HANDBOOK_CARDS } = require('../../utils/handbook')
const { REGION_MAP, BACKGROUND_MAP, OCCASION_MAP } = require('../../utils/util')

Page({
  data: {
    showProfile: false,
    profileStep: 1,
    profile: {
      gender: '',
      region: '',
      background: '',
      occasion: '',
      people: []
    },
    regions: [
      { value: 'north', label: '华北·山东·河南', tag: '礼数严格，规矩多' },
      { value: 'northeast', label: '东北三省', tag: '酒桌文化强，亲戚多' },
      { value: 'northwest', label: '西北·陕甘宁', tag: '传统习俗，重视礼节' },
      { value: 'jiangzhe', label: '江浙沪·杭州', tag: '生活品质导向，相对开明' },
      { value: 'central', label: '华中·湖南湖北安徽', tag: '中等习俗，家庭差异大' },
      { value: 'southwest', label: '西南·四川重庆', tag: '热情随和，相对轻松' },
      { value: 'guangdong', label: '两广·华南', tag: '务实，粤语地区有特定礼节' },
      { value: 'chaoshan', label: '潮汕·闽南', tag: '习俗最复杂，规矩最多' },
      { value: 'firsttier', label: '北上广深·一线城区', tag: '习俗淡化，以个人风格为主' }
    ],
    occasions: [
      { value: 'first', label: '初次登门', desc: '第一次走进这个家门，互相认识' },
      { value: 'formal', label: '正式相见', desc: '见过几面了，这次认真来谈的' },
      { value: 'wedding', label: '婚事考察', desc: '两家人开始讨论婚事的可能性' },
      { value: 'holiday', label: '节日走动', desc: '已是常来的关系，节日礼数上门' },
      { value: 'engage', label: '准备订亲', desc: '双方已确认，来定具体事宜' }
    ],
    peopleOptions: [
      { value: 'parents_only', label: '只有对方父母两人', warn: '' },
      { value: 'grandparents', label: '有爷爷奶奶/外公外婆', warn: '需额外准备礼物和问候' },
      { value: 'siblings', label: '有成年兄弟姐妹', warn: '' },
      { value: 'kids', label: '有未成年小孩', warn: '需要准备见面红包' },
      { value: 'relatives', label: '临时有亲戚在场', warn: '' },
      { value: 'neighbors', label: '可能遇到父母的朋友或邻居', warn: '' }
    ],
    dailyCard: {},
    dailyIndex: 1
  },

  onLoad() {
    this._loadDailyCard()
    this._loadSavedProfile()
  },

  onShow() {
    wx.setNavigationBarTitle({ title: '见家长' })
  },

  _loadDailyCard() {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
    const idx = dayOfYear % HANDBOOK_CARDS.length
    this.setData({
      dailyCard: HANDBOOK_CARDS[idx],
      dailyIndex: idx + 1
    })
  },

  _loadSavedProfile() {
    const saved = wx.getStorageSync('userProfile')
    if (saved) {
      this.setData({ profile: saved })
    }
  },

  // 开始测评
  startQuiz() {
    const app = getApp()
    if (app.globalData.profile) {
      // 已有画像，直接进入
      wx.navigateTo({ url: '/pages/quiz/quiz' })
    } else {
      // 展示4步画像弹层
      this.setData({ showProfile: true, profileStep: 1 })
    }
  },

  closeProfile() {
    this.setData({ showProfile: false })
  },

  // 步骤1：选性别
  selectGender(e) {
    this.setData({ 'profile.gender': e.currentTarget.dataset.val })
  },

  // 步骤2：选地区
  selectRegion(e) {
    this.setData({ 'profile.region': e.currentTarget.dataset.val })
  },

  // 步骤3：选场景
  selectOccasion(e) {
    this.setData({ 'profile.occasion': e.currentTarget.dataset.val })
  },

  // 步骤4：人员多选
  togglePeople(e) {
    const val = e.currentTarget.dataset.val
    const people = [...this.data.profile.people]
    const idx = people.indexOf(val)
    if (idx === -1) {
      people.push(val)
    } else {
      people.splice(idx, 1)
    }
    this.setData({ 'profile.people': people })
  },

  // 下一步
  nextStep() {
    const { profileStep, profile } = this.data

    // 验证
    if (profileStep === 1 && !profile.gender) {
      wx.showToast({ title: '请选择性别', icon: 'none' })
      return
    }
    if (profileStep === 2 && !profile.region) {
      wx.showToast({ title: '请选择地区', icon: 'none' })
      return
    }
    if (profileStep === 3 && !profile.occasion) {
      wx.showToast({ title: '请选择见面性质', icon: 'none' })
      return
    }

    if (profileStep < 4) {
      this.setData({ profileStep: profileStep + 1 })
    } else {
      // 完成，保存画像进入测评
      if (profile.people.length === 0) {
        profile.people = ['parents_only']
      }
      wx.setStorageSync('userProfile', profile)
      const app = getApp()
      app.globalData.profile = profile
      this.setData({ showProfile: false })
      wx.navigateTo({ url: '/pages/quiz/quiz' })
    }
  },

  prevStep() {
    const { profileStep } = this.data
    if (profileStep > 1) {
      this.setData({ profileStep: profileStep - 1 })
    }
  },

  // 导航
  goHandbook() {
    wx.switchTab({ url: '/pages/handbook/handbook' })
  },

  goCouple() {
    wx.switchTab({ url: '/pages/couple/couple' })
  },

  goHehun() {
    wx.navigateTo({ url: '/pages/hehun/hehun' })
  },

  buyFullPackage() {
    const app = getApp()
    if (app.isPurchased('fullPackage')) {
      wx.showToast({ title: '已购买全套备考', icon: 'success' })
      return
    }
    // 跳转支付逻辑
    wx.navigateTo({ url: '/pages/hehun/hehun?showBuy=fullPackage' })
  }
})
