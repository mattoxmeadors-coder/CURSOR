Page({
  data: {
    result: null,
  },

  onLoad(query) {
    if (query.payload) {
      try {
        const decoded = decodeURIComponent(query.payload);
        const result = JSON.parse(decoded);
        this.setData({ result });
      } catch (error) {
        this.setData({
          result: {
            heroTitle: "结果加载失败",
            heroSummary: "传参解析失败，请返回首页重新生成。",
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
          },
        });
      }
    }
  },

  backHome() {
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
