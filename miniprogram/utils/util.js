/**
 * 通用工具函数
 */

// 格式化日期
function formatDate(date) {
  const d = date || new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

// 动态年份
function currentYear() {
  return new Date().getFullYear()
}

// 防抖
function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// 简单的唯一ID
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

// 分数对应颜色
function scoreColor(score) {
  if (score >= 90) return '#5ABF8A'
  if (score >= 70) return '#C9A96E'
  if (score >= 50) return '#E08A5A'
  return '#E05A5A'
}

// 分数对应评语
function scoreLabel(score) {
  if (score >= 90) return '准备充分，今天大概率顺利'
  if (score >= 70) return '基础扎实，有几个细节值得再打磨'
  if (score >= 50) return '还有盲区，建议今天认真补一下'
  return '准备不足，现在补还来得及'
}

// 地区标签
const REGION_MAP = {
  north: '华北·山东·河南',
  northeast: '东北三省',
  northwest: '西北·陕甘宁',
  jiangzhe: '江浙沪·杭州',
  central: '华中·湖南湖北安徽',
  southwest: '西南·四川重庆',
  guangdong: '两广·华南',
  chaoshan: '潮汕·闽南',
  firsttier: '北上广深·一线城区'
}

const BACKGROUND_MAP = {
  govt: '体制内',
  business: '经商/私营企业主',
  worker: '工薪/普通职工',
  rural: '农业/农村',
  academic: '学术/医生/教师'
}

const OCCASION_MAP = {
  first: '初次登门',
  formal: '正式相见',
  wedding: '婚事考察',
  holiday: '节日走动',
  engage: '准备订亲'
}

module.exports = {
  formatDate,
  currentYear,
  debounce,
  genId,
  scoreColor,
  scoreLabel,
  REGION_MAP,
  BACKGROUND_MAP,
  OCCASION_MAP
}
