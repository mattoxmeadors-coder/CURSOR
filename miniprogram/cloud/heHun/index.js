/**
 * 生辰婚配分析 · 云函数
 * 调用 DeepSeek API（国内直连，成本极低）
 * 替换 DEEPSEEK_API_KEY 为实际密钥（通过云开发环境变量注入，不放前端）
 */

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const https = require('https')

// DeepSeek API 调用
function callDeepSeek(prompt) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.DEEPSEEK_API_KEY || ''
    if (!apiKey) {
      reject(new Error('DEEPSEEK_API_KEY 未配置'))
      return
    }

    const body = JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `你是一位精通中国传统民俗文化的婚配分析师。
你的任务是基于四柱八字和五行学说，提供婚配分析。
输出必须是可直接解析的JSON格式，不要加任何markdown代码块包装。
语气温和、有洞见，避免算命套话，用现代白话诠释传统智慧。
所有内容仅供参考，基于民俗文化，不构成专业建议。`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000
    })

    const options = {
      hostname: 'api.deepseek.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(body)
      }
    }

    const req = https.request(options, res => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices[0].message.content
          resolve(content)
        } catch (e) {
          reject(e)
        }
      })
    })

    req.on('error', reject)
    req.setTimeout(25000, () => {
      req.destroy(new Error('请求超时'))
    })
    req.write(body)
    req.end()
  })
}

// 构建分析提示词
function buildPrompt(myBirthday, myCalType, myGender, taBirthday, taCalType, taGender) {
  return `请分析以下两人的婚配情况，并以JSON格式返回结果：

甲方信息：
- 出生日期：${myBirthday}（${myCalType === 'solar' ? '公历/阳历' : '农历/阴历'}）
- 性别：${myGender === 'male' ? '男' : '女'}

乙方信息：
- 出生日期：${taBirthday}（${taCalType === 'solar' ? '公历/阳历' : '农历/阴历'}）
- 性别：${taGender === 'male' ? '男' : '女'}

请返回以下JSON结构（直接返回JSON，不要加代码块）：
{
  "index": 0-100的整数婚配指数,
  "summary": "一句话概述（20字以内）",
  "bazi": [
    {"pillar": "年柱", "gan": "天干字", "zhi": "地支字"},
    {"pillar": "月柱", "gan": "天干字", "zhi": "地支字"},
    {"pillar": "日柱", "gan": "天干字", "zhi": "地支字"},
    {"pillar": "时柱", "gan": "天干字", "zhi": "地支字"}
  ],
  "wuxing": "五行关系白话分析（80字以内，不用专业术语）",
  "dimensions": [
    {"name": "情感", "score": 60-100的整数},
    {"name": "沟通", "score": 60-100的整数},
    {"name": "发展", "score": 60-100的整数},
    {"name": "家庭", "score": 60-100的整数}
  ],
  "advantages": ["优势1（20字以内，有画面感）", "优势2", "优势3"],
  "challenges": [
    {"title": "挑战1描述（20字以内）", "suggest": "化解建议（30字以内）"},
    {"title": "挑战2描述", "suggest": "化解建议"}
  ],
  "tableTopic": "饭桌话题锦囊：如何在见家长时自然引出这份报告（60字以内）",
  "lastWord": "给两人的最后一句话（30字以内，温暖有力量）"
}`
}

exports.main = async (event, context) => {
  const { myBirthday, myCalType, myGender, taBirthday, taCalType, taGender } = event

  if (!myBirthday || !taBirthday) {
    return { error: '缺少必要参数' }
  }

  try {
    const prompt = buildPrompt(myBirthday, myCalType, myGender, taBirthday, taCalType, taGender)
    const rawContent = await callDeepSeek(prompt)

    let report
    try {
      // 清理可能的markdown包装
      const cleaned = rawContent.replace(/```json\n?|\n?```/g, '').trim()
      report = JSON.parse(cleaned)
    } catch (parseErr) {
      console.error('JSON解析失败', rawContent)
      return { error: 'AI响应格式错误', raw: rawContent }
    }

    return report

  } catch (err) {
    console.error('云函数执行失败', err)
    return { error: err.message }
  }
}
