Page({
  data: {
    result: null,
    topRiskTitle: "核心风险待生成",
    riskTone: {
      high: "高压",
      medium: "中压",
      low: "低压",
    },
  },

  applyResult(result) {
    this.setData({
      result,
      topRiskTitle:
        (result.topRisks && result.topRisks[0] && result.topRisks[0].title) ||
        "核心风险待生成",
    });
  },

  onLoad() {
    const result = wx.getStorageSync("copilotResult");
    if (result) {
      this.applyResult(result);
      return;
    }

    this.applyResult({
        heroTitle: "结果加载失败",
        heroSummary: "本次方案未成功缓存，请返回首页重新生成。",
        riskLevel: "medium",
        riskScore: 0,
        personaLabel: "待重新生成",
        topRisks: [],
        battlePlan: [],
        alignmentSummary: "",
        alignmentActions: [],
        giftPlan: { title: "", summary: "", items: [] },
        contentPack: {
          shortVideoHooks: [],
          socialPosts: [],
          privateDomainOpen: "",
        },
        knowledgeRecommendations: [],
        simulationPrompts: [],
    });
  },

  handleBack() {
    wx.navigateBack({
      delta: 1,
      fail: () => {
        wx.reLaunch({
          url: "/pages/index/index",
        });
      },
    });
  },
});
