const { genId } = require('../../utils/util')
// HANDBOOK_CARDS 在 onLoad 后懒加载，避免冷启动超时

// 暗号候选库
const SIGNAL_POOL = [
  { signal: '摸右耳', meaning: '快帮我转移话题' },
  { signal: '摸左耳', meaning: '可以提走了' },
  { signal: '喝一口茶', meaning: '气氛不对，小心' },
  { signal: '说「挺好的」', meaning: '状态不错，正常进行' },
  { signal: '摸摸脖子', meaning: '快来救我' },
  { signal: '眨两下眼', meaning: '该你接话了' },
  { signal: '咳嗽一声', meaning: '话题不能继续了' },
  { signal: '放下筷子', meaning: '我们可以走了' }
]

// 情侣通关题库（从个人题库精选+专属）
const COUPLE_QUESTIONS_BASIC = [
  // 序幕 — 暗号设置（游戏的第一步就是两人一起生成暗号）
  { id: 'c1', stage: '序幕·出租车里',
    text: '出发前，你们约好暗号了吗？\n\n一个「救我」暗号，一个「走了」暗号——\n就两个，今天会用上的。',
    hint: '点下面的按钮，随机生成你们专属的暗号',
    type: 'signal_gen', options: [] },
  { id: 'c2', stage: '序幕·出租车里', text: '如果今天一切顺利，你希望结束后第一句说什么？', hint: '写下来，等一下看看TA写的是什么', type: 'open', options: [] },

  // 进门关
  { id: 'c3', stage: '进门关', text: '进门后，谁先和父母开始话题？', hint: '你们有分工吗',
    options: [{ label: '我来开头，TA补充' }, { label: 'TA来开头，我配合' }, { label: '一起来，看谁先说' }, { label: '等父母先说' }], type: 'single' },
  { id: 'c4', stage: '进门关', text: '礼物是谁选的？有没有分别给父亲和母亲选？', hint: '细节决定第一印象',
    options: [{ label: '一起选的，父母各有专属' }, { label: 'TA选的，给全家的通用礼物' }, { label: '我选的，主要给父亲' }, { label: '临时买的，还没仔细想' }], type: 'single' },
  { id: 'c5', stage: '进门关', text: '对方父母怎么叫，你们提前确认过吗？', hint: '第一声称呼会被记住很久',
    options: [{ label: '确认过，两人叫法一致' }, { label: '各自问过，没对齐' }, { label: '没问过，到了再看' }, { label: '知道叫什么，但没提' }], type: 'single' },
  { id: 'c6', stage: '进门关', text: '进门换鞋后，你的第一个动作是什么？',
    options: [{ label: '主动问候父母，站稳再说' }, { label: '帮TA拿礼物，先交给父母' }, { label: '四处看看，等TA来引导' }, { label: '直接走进客厅' }], type: 'single' },
  { id: 'c7', stage: '进门关', text: '第一个冷场出现时，谁来打破？', hint: '你们怎么分工的',
    options: [{ label: '我来打破冷场' }, { label: 'TA来打破冷场' }, { label: '看情况，谁想到了谁来' }, { label: '没想过这个场景' }], type: 'single' },

  // 落座关
  { id: 'c8', stage: '落座关', text: '落座时，你会主动等长辈先坐吗？',
    options: [{ label: '会，而且我会请长辈先坐' }, { label: '会，但一般等他们先坐' }, { label: '不太注意这个顺序' }, { label: '没想过这件事' }], type: 'single' },
  { id: 'c9', stage: '落座关', text: '父亲沉默不说话，你会怎么做？', hint: '这可能是今天最难的5分钟',
    options: [{ label: '主动找话题问他' }, { label: '让TA去接，我观察' }, { label: '自然聊，等他开口' }, { label: '假装在看别处' }], type: 'single' },
  { id: 'c10', stage: '落座关', text: '你们两个，被拿来和别人比较了，你怎么接？',
    options: [{ label: '"我们可能不一样，但我们有自己的方式"' }, { label: '"是啊，那个人很好……"（认同）' }, { label: '笑一笑，不接这个话题' }, { label: '有点不舒服，但忍着' }], type: 'single' },
  { id: 'c11', stage: '落座关', text: '单独被问到婚期，你的第一反应是？',
    options: [{ label: '"我们在商量中，大方向有了"（给方向不给时间）' }, { label: '说一个具体年份' }, { label: '"这个要问TA……"' }, { label: '没想好怎么回答' }], type: 'single' },

  // 饭桌关（精选9题）
  { id: 'c12', stage: '饭桌关', text: '第一筷，你怎么处理？',
    options: [{ label: '等父亲先动，或者请他先请' }, { label: '等全家最长辈先动' }, { label: '自然开动，不太注意这个' }, { label: '帮长辈夹了一筷子' }], type: 'single' },
  { id: 'c13', stage: '饭桌关', text: '父亲去阳台抽烟，你去不去？',
    options: [{ label: '等30秒再拿茶跟过去' }, { label: '立刻跟上' }, { label: '不去，继续和母亲聊' }, { label: '问了TA的眼神再决定' }], type: 'single' },
  { id: 'c14', stage: '饭桌关', text: '被问收入/工作，你的答题思路是？',
    options: [{ label: '行业+岗位+发展方向，完整回答' }, { label: '直接说数字，透明' }, { label: '"还可以，以后会更好"，带过' }, { label: '说完收入主动提规划' }], type: 'single' },
  { id: 'c15', stage: '饭桌关', text: '母亲给你夹了你不想吃的菜，你怎么处理？',
    options: [{ label: '动一口，说一句话' }, { label: '不动，等机会转移话题' }, { label: '说"谢谢阿姨，我不太吃这个"' }, { label: '全部吃完，哪怕不喜欢' }], type: 'single' },
  { id: 'c16', stage: '饭桌关', text: '父母饭桌上小争执了一下，你的反应？',
    options: [{ label: '找话题打岔，自然带走气氛' }, { label: '假装没看见，低头扒饭' }, { label: '帮其中一方说话' }, { label: '看TA，让TA处理' }], type: 'single' },
  { id: 'c17', stage: '饭桌关', text: '长辈给你倒茶，你做了什么动作？',
    options: [{ label: '双手端杯+叩指礼' }, { label: '把杯子端起来配合' }, { label: '说谢谢，等他倒完' }, { label: '"不用不用，我自己来"' }], type: 'single' },
  { id: 'c18', stage: '饭桌关', text: '你们的婚期话题被提起来，你们的回答一致吗？',
    options: [{ label: '完全一致（提前对齐过）' }, { label: '方向一致，细节没对齐' }, { label: '没对齐过，现场发现差了' }, { label: '没讨论过，各说各的' }], type: 'single' },
  { id: 'c19', stage: '饭桌关', text: '合照时，你站在哪里？',
    options: [{ label: '让父母站中间，我们站两边' }, { label: '和TA夹在父母中间' }, { label: '等别人安排' }, { label: '主动说"我来拍"，退出合照' }], type: 'single' },
  { id: 'c20', stage: '饭桌关', text: '今天整顿饭，你说话的比例大约是多少？',
    options: [{ label: '20-30%，让父母和TA多说' }, { label: '50%以上，一直在聊' }, { label: '很少，不太开口' }, { label: '没意识到这件事' }], type: 'single' },

  // 饭后关（精选3题）
  { id: 'c21', stage: '饭后关', text: '饭后主动起来帮忙收拾，被说"不用"，你怎么做？',
    options: [{ label: '再提一件更小的事（"那我来擦桌子"）' }, { label: '坐回去，尊重她的决定' }, { label: '"没事，我当锻炼"，继续帮' }, { label: '拉着TA一起来帮' }], type: 'single' },
  { id: 'c22', stage: '饭后关', text: '你被单独留下和父亲谈话，你的策略是？',
    options: [{ label: '主动感谢今天这顿饭，说一个今天印象深的细节' }, { label: '等他先说，他问什么答什么' }, { label: '"叔叔，您有什么想问的直说"' }, { label: '有点紧张，看他怎么开' }], type: 'single' },
  { id: 'c23', stage: '饭后关', text: '临走时父母叫你"朋友"而不是"对象"，你怎么反应？',
    options: [{ label: '"叔叔阿姨，以后我们常来"，不纠结这个词' }, { label: '当没听见，继续正常道别' }, { label: '心里有点低落，但不表现' }, { label: '小心地纠正一下' }], type: 'single' },

  // 电梯题（必须最后一题）
  { id: 'c25', stage: '电梯揭晓', text: '电梯门关上，只剩你们两个——\n你说的第一句话是什么？', hint: '写下来，TA也会写，一起揭晓',
    type: 'open', options: [] }
]

Page({
  data: {
    pageState: 'landing',
    selectedVersion: 'full',
    warmupCards: [],

    gameQuestions: [],
    gameIndex: 0,
    gameTotalCount: 0,
    gameProgressPct: 0,
    currentGameQ: null,
    gameSelectedIdx: null,
    gameOpenAnswer: '',
    gameAnswers: {},
    optionLabels: ['A', 'B', 'C', 'D'],

    timerCount: 30,
    timerWarning: false,

    // 幕间过场
    transitionStage: '',
    transitionTitle: '',
    transitionDesc: '',
    transitionPct: 0,

    // 电梯揭晓（逐字打印）
    elevatorA: '',
    elevatorB: '',
    elevatorADisplay: '',
    elevatorBDisplay: '',
    elevatorAReady: false,
    elevatorBReady: false,

    // 暗号
    signal1: null,
    signal2: null,
    signalConfirmed: false,

    showPayModal: false,
    payProduct: null
  },

  onLoad(options) {
    if (options.showBuy) {
      this._showBuyModal()
    }
    // 懒加载 handbook 暖身数据
    wx.nextTick(() => {
      const { HANDBOOK_CARDS } = require('../../utils/handbook')
      this.setData({ warmupCards: HANDBOOK_CARDS.slice(0, 5) })
    })
  },

  selectVersion(e) {
    this.setData({ selectedVersion: e.currentTarget.dataset.v })
  },

  startCouple() {
    const app = getApp()
    const version = this.data.selectedVersion

    if (version === 'full' && !app.isPurchased('coupleFull') && !app.isPurchased('fullPackage')) {
      this.setData({
        showPayModal: true,
        payProduct: {
          key: 'coupleFull',
          name: '情侣通关·完整版',
          desc: '42题双人异步通关，全程电梯揭晓体验',
          price: '4.9',
          originalPrice: null
        }
      })
      return
    }
    // 基础版免费，直接进入

    // 付款完成，创建会话
    const sessionId = genId()
    wx.setStorageSync('coupleSession', { sessionId, role: 'A', version })
    this.setData({ sessionId, role: 'A', pageState: 'waiting' })
    this._initGameQuestions()
  },

  joinCouple() {
    wx.showModal({
      title: '加入通关',
      content: '请输入TA发给你的邀请码',
      editable: true,
      placeholderText: '邀请码',
      success: (res) => {
        if (res.confirm && res.content) {
          const session = wx.getStorageSync('coupleSession_' + res.content)
          if (session) {
            this.setData({
              sessionId: res.content,
              role: 'B',
              pageState: 'playing'
            })
            this._initGameQuestions()
            this._startTimer()
          } else {
            // 模拟加入（本地测试）
            this.setData({ sessionId: res.content, role: 'B', pageState: 'playing' })
            this._initGameQuestions()
            this._startTimer()
          }
        }
      }
    })
  },

  _initGameQuestions() {
    const questions = COUPLE_QUESTIONS_BASIC
    this.setData({
      gameQuestions: questions,
      gameTotalCount: questions.length,
      currentGameQ: questions[0],
      gameIndex: 0,
      gameProgressPct: Math.round(1 / questions.length * 100)
    })
  },

  selectGameOption(e) {
    this.setData({ gameSelectedIdx: Number(e.currentTarget.dataset.idx) })
  },

  onGameOpenInput(e) {
    this.setData({ gameOpenAnswer: e.detail.value })
  },

  generateSignals() {
    const pool = [...SIGNAL_POOL]
    const i1 = Math.floor(Math.random() * pool.length)
    const s1 = pool.splice(i1, 1)[0]
    const i2 = Math.floor(Math.random() * pool.length)
    const s2 = pool[i2]
    this.setData({ signal1: s1, signal2: s2, signalConfirmed: false })
  },

  reshuffleSignals() {
    this.generateSignals()
  },

  confirmSignals() {
    if (!this.data.signal1) {
      this.generateSignals()
    }
    this.setData({ signalConfirmed: true })
    setTimeout(() => this._nextGameQuestion(this.data.gameAnswers), 800)
  },

  confirmGameAnswer() {
    const { gameSelectedIdx, gameOpenAnswer, gameIndex, gameQuestions, gameAnswers } = this.data
    const q = gameQuestions[gameIndex]
    if (q.type !== 'open' && gameSelectedIdx === null) return
    if (q.type === 'open' && !gameOpenAnswer) return

    const val = q.type === 'open' ? gameOpenAnswer : gameSelectedIdx
    const newAnswers = { ...gameAnswers, [q.id]: val }

    if (q.id === 'c25') {
      this._startElevator(newAnswers, gameOpenAnswer)
      return
    }
    this._nextGameQuestion(newAnswers)
  },

  _nextGameQuestion(newAnswers) {
    const { gameIndex, gameQuestions } = this.data
    const nextIndex = gameIndex + 1

    if (nextIndex >= gameQuestions.length) {
      this.setData({ gameAnswers: newAnswers, pageState: 'waitingResult' })
      setTimeout(() => this._startElevator(newAnswers, '还好吧？'), 3000)
      return
    }

    const nextQ = gameQuestions[nextIndex]
    const pct = Math.round((nextIndex + 1) / gameQuestions.length * 100)

    // 检查是否进入新幕，需要幕间过场
    const prevStage = gameQuestions[gameIndex].stage
    const nextStage = nextQ.stage
    if (prevStage !== nextStage && nextStage !== '序幕·出租车里') {
      this._showTransition(nextStage, newAnswers, nextIndex)
      return
    }

    this.setData({
      gameAnswers: newAnswers,
      gameIndex: nextIndex,
      currentGameQ: nextQ,
      gameSelectedIdx: null,
      gameOpenAnswer: '',
      gameProgressPct: pct
    })
    this._startTimer()
  },

  // 幕间过场
  _showTransition(stage, answers, nextIndex) {
    const stageMap = {
      '进门关':  { title: '门打开了', desc: '第一印象，只有一次机会' },
      '落座关':  { title: '落座，气氛有些微妙', desc: '你们分开坐了，各自应对' },
      '饭桌关':  { title: '饭菜上桌', desc: '最难的一关来了' },
      '饭后关':  { title: '饭吃完了', desc: '还没结束，余震来了' },
      '电梯揭晓':{ title: '电梯门关上', desc: '只剩你们两个' }
    }
    const info = stageMap[stage] || { title: stage, desc: '' }

    this.setData({
      pageState: 'scene_transition',
      transitionStage: stage,
      transitionTitle: info.title,
      transitionDesc: info.desc,
      transitionPct: 0,
      gameAnswers: answers
    })

    setTimeout(() => this.setData({ transitionPct: 100 }), 100)
    setTimeout(() => {
      const { gameQuestions } = this.data
      const pct = Math.round((nextIndex + 1) / gameQuestions.length * 100)
      this.setData({
        pageState: 'playing',
        gameIndex: nextIndex,
        currentGameQ: gameQuestions[nextIndex],
        gameSelectedIdx: null,
        gameOpenAnswer: '',
        gameProgressPct: pct
      })
      this._startTimer()
    }, 2400)
  },

  // 电梯揭晓 + 逐字打印
  _startElevator(answers, myText) {
    const taText = '我腿有点抖……你呢'
    this.setData({
      gameAnswers: answers,
      pageState: 'elevator',
      elevatorA: myText,
      elevatorB: taText,
      elevatorADisplay: '',
      elevatorBDisplay: '',
      elevatorAReady: false,
      elevatorBReady: false
    })

    // A方逐字打印
    let ai = 0
    const printA = setInterval(() => {
      ai++
      this.setData({ elevatorADisplay: myText.slice(0, ai) })
      if (ai >= myText.length) {
        clearInterval(printA)
        this.setData({ elevatorAReady: true })
        // A打完后延迟500ms打B
        let bi = 0
        setTimeout(() => {
          const printB = setInterval(() => {
            bi++
            this.setData({ elevatorBDisplay: taText.slice(0, bi) })
            if (bi >= taText.length) {
              clearInterval(printB)
              this.setData({ elevatorBReady: true })
            }
          }, 60)
        }, 500)
      }
    }, 60)
  },

  _startTimer() {
    // 用实例属性而非 data 存定时器，避免不必要的 setData 渲染
    clearInterval(this._timer)
    let count = 30
    this.setData({ timerCount: count, timerWarning: false })
    this._timer = setInterval(() => {
      count--
      this.setData({ timerCount: count, timerWarning: count <= 10 })
      if (count <= 0) {
        clearInterval(this._timer)
        this._timeoutSkip()
      }
    }, 1000)
  },

  _timeoutSkip() {
    const { gameIndex, gameQuestions, gameAnswers } = this.data
    const q = gameQuestions[gameIndex]
    const newAnswers = { ...gameAnswers, [q.id]: 'timeout' }
    this._nextGameQuestion(newAnswers)
  },

  shareInvite() {
    wx.showShareMenu({ withShareTicket: true })
    wx.showToast({ title: '已开启分享', icon: 'success' })
  },

  goResultPage() {
    wx.navigateTo({ url: '/pages/result/result?mode=couple' })
  },

  openCS() {
    wx.openCustomerServiceChat({
      extInfo: { url: 'https://work.weixin.qq.com/kfid/your-kf-id' },
      corpId: 'your-corp-id',
      fail() {
        wx.showModal({ title: '联系顾问', content: '搜索公众号「见家长不翻车」→ 发送「礼物」', confirmText: '好的', showCancel: false })
      }
    })
  },

  _showBuyModal() {
    this.setData({
      showPayModal: true,
      payProduct: {
        key: 'coupleFull',
        name: '情侣通关·完整版',
        desc: '42题，找出你们真正没对上的地方，电梯揭晓',
        price: '4.9',
        originalPrice: null
      }
    })
  },

  onPayClose() {
    this.setData({ showPayModal: false })
  },

  onPaySuccess(e) {
    const app = getApp()
    app.savePurchased(e.detail.key)
    this.setData({ showPayModal: false })
    // 支付成功，根据版本继续
    const version = e.detail.key === 'coupleFull' ? 'full' : 'basic'
    this.setData({ selectedVersion: version, pageState: 'waiting' })
    this._initGameQuestions()
  },

  onUnload() {
    clearInterval(this._timer)
  }
})
