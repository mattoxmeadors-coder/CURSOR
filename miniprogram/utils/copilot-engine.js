const {
  familyStyles,
  parentBackgrounds,
  relationStages,
  knowledgeCards,
} = require("./copilot-data");

function resolveFamilyStyle(id) {
  return familyStyles.find((style) => style.id === id) || familyStyles[0];
}

function resolveStageLabel(id) {
  const match = relationStages.find((stage) => stage.id === id);
  return match ? match.label : relationStages[0].label;
}

function resolveBackgroundLabel(id) {
  const match = parentBackgrounds.find((item) => item.id === id);
  return match ? match.label : parentBackgrounds[0].label;
}

function parseBudgetLevel(budget) {
  const matches = String(budget || "").match(/\d+/g) || [];
  const numbers = matches.map((item) => Number(item));
  if (!numbers.length) return "mid";
  const max = Math.max.apply(null, numbers);
  if (max <= 300) return "lean";
  if (max <= 800) return "mid";
  return "premium";
}

function decideRiskLevel(input) {
  let score = 38;

  score += Math.min((input.primaryStressors || []).length * 6, 24);
  score += (input.attendees || []).includes("有祖辈") ? 8 : 0;
  score += (input.attendees || []).includes("可能有亲戚") ? 6 : 0;
  score += (input.attendees || []).includes("可能有邻居或父母朋友") ? 5 : 0;
  score += input.parentPressure === "yes" ? 18 : input.parentPressure === "partial" ? 10 : 0;
  score += input.alignmentReady === "no" ? 16 : input.alignmentReady === "partial" ? 8 : 0;
  score += input.mode === "align" ? 6 : 0;
  score += input.mode === "battlePlan" ? 4 : 0;
  score += /婚期|房|彩礼|收入|工作|定居/.test(input.notes || "") ? 10 : 0;
  score = Math.min(score, 96);

  if (score >= 75) return { score, level: "high" };
  if (score >= 50) return { score, level: "medium" };
  return { score, level: "low" };
}

function inferPersona(input, riskLevel) {
  if (input.alignmentReady === "no") return "配合失焦型";
  if ((input.primaryStressors || []).includes("怕礼数拿捏不准")) return "真诚拘谨型";
  if (
    (input.primaryStressors || []).includes("怕被问收入/房车") ||
    (input.primaryStressors || []).includes("怕婚期话题")
  ) {
    return riskLevel === "high" ? "临场硬撑型" : "稳中有礼型";
  }
  if ((input.primaryStressors || []).includes("怕饭桌场景失手")) return "热情过满型";
  return "稳中有礼型";
}

function buildRiskItems(input, style) {
  const items = [];
  const stressors = input.primaryStressors || [];

  if (stressors.includes("怕被问收入/房车")) {
    items.push({
      title: "现实条件问答",
      severity: input.parentPressure === "yes" ? "high" : "medium",
      reason: `这类${style.label}家庭会观察稳定度，最忌讳说大话或把话说满。`,
    });
  }

  if (stressors.includes("怕婚期话题")) {
    items.push({
      title: "婚期与承诺边界",
      severity: input.alignmentReady === "no" ? "high" : "medium",
      reason: "如果你和 TA 没统一口径，现场最容易出现一人说太满、一人来不及补位。",
    });
  }

  if (stressors.includes("怕饭桌场景失手")) {
    items.push({
      title: "饭桌节奏与善意接球",
      severity: "medium",
      reason: "长辈夹菜、倒茶、敬酒时，最容易在过度客气和过度表现之间失衡。",
    });
  }

  if (stressors.includes("怕和 TA 配合不好")) {
    items.push({
      title: "情侣协同失配",
      severity: "high",
      reason: "真正翻车往往不是一个人不懂，而是两个人没有主次和补位方案。",
    });
  }

  if (items.length < 3) {
    items.push({
      title: "第一印象强度控制",
      severity: "medium",
      reason: `面对${style.label}，重点不是热闹，而是分寸、节奏和观察力。`,
    });
  }

  const rank = { high: 3, medium: 2, low: 1 };
  return items.sort((a, b) => rank[b.severity] - rank[a.severity]).slice(0, 3);
}

function buildBattlePlan(input, style) {
  const stageLabel = resolveStageLabel(input.relationStage);
  return [
    {
      phase: "见面前 24 小时",
      actions: [
        `把这次见面定义为「${stageLabel}」场景，不要按普通吃饭的松弛心态上桌。`,
        `围绕 ${style.focus.join("、")} 做最后校准：礼物、称呼、时间和穿搭统一成一条线。`,
        "先和 TA 对齐三个问题：婚期怎么答、工作城市怎么答、谁先接长辈第一轮问题。",
      ],
    },
    {
      phase: "进门前 10 分钟",
      actions: [
        "礼物先递再落座，称呼统一用叔叔/阿姨，不抢亲近感。",
        `针对${style.label}，第一轮表达保持 ${style.scriptTone}，宁可少一点，也不要抢节奏。`,
        "手机静音，进门后先观察谁是节奏中心，再决定自己要不要主动接话。",
      ],
    },
    {
      phase: "饭桌阶段",
      actions: [
        "先接善意，再表达边界：夹菜、倒茶、敬酒都先感谢，再决定接多少。",
        "冷场时回到共同信息，不要硬抖机灵，也不要把自己缩没了。",
        "如果 TA 在说，你负责补稳，不要抢答；如果 TA 卡住，你负责接一层，不要长篇接管。",
      ],
    },
    {
      phase: "敏感问题阶段",
      actions: [
        "回答顺序固定为：先接住关心 -> 再说现状 -> 最后给时间窗口。",
        "不替两个人拍板，不承诺超出控制范围的事，不拿情绪顶问题。",
        `面对${resolveBackgroundLabel(input.parentBackground)}背景家庭，越具体越好，但具体不等于确定性承诺。`,
      ],
    },
    {
      phase: "收尾与回家后",
      actions: [
        "临走时感谢招待，用一句具体感受收尾，不需要过度长文表忠心。",
        "回家先和 TA 复盘三件事：谁回答最顺、哪里差点翻、下次要统一什么。",
        "当天可发简短感谢消息，为下一次往来留下自然续口。",
      ],
    },
  ];
}

function buildAlignment(input, style) {
  if (input.alignmentReady === "yes") {
    return {
      summary: `你和 TA 已经有基础口径，接下来重点不是再讨论观点，而是按 ${style.label} 的场子分好主次和补位。`,
      actions: [
        "更稳的一方负责第一轮敏感问题开场。",
        "更松弛的一方负责冷场时把气氛拉回家常。",
        "任何涉及婚期、买房、城市的问题，都先给阶段性表达，不直接拍板。",
      ],
    };
  }

  return {
    summary:
      "你们目前口径还不够稳。这次见面最大的风险不是不会答，而是一个人答太满、另一个人当场改口。",
    actions: [
      "见面前至少统一：婚期、工作城市、房车计划、节日安排四个问题。",
      "约定一个补位规则：谁先开口，谁负责收尾，谁在对方说满时把话拉回阶段性表述。",
      `面对${style.label}家庭，不要把“有诚意”演成“过度确定”。`,
    ],
  };
}

function buildGiftPlan(input, style) {
  const budgetLevel = parseBudgetLevel(input.budget);

  if (budgetLevel === "lean") {
    return {
      title: "轻预算稳妥组合",
      summary: `预算不高也能做稳，关键是结构清楚，符合 ${style.giftTone} 的送礼调性。`,
      items: [
        "2-4 样礼物，避免单一奢侈品孤零零顶在前面。",
        "优先实用型：茶点、营养品、应季水果礼盒。",
        "如果有祖辈，额外补一件更偏长辈向的小体面礼物。",
      ],
    };
  }

  if (budgetLevel === "premium") {
    return {
      title: "高预算但不过度表演",
      summary: "预算高时最怕失衡，不是越贵越好，而是要避免压场和制造负担。",
      items: [
        "保持 4-6 样结构，主礼有体面，副礼有温度。",
        "不要让礼物比人更高调，价格感尽量弱化，体面感放在包装和组合逻辑上。",
        "如果是正式相见或谈婚论嫁，提前和 TA 确认禁忌与偏好。",
      ],
    };
  }

  return {
    title: "标准稳妥组合",
    summary: `按 ${style.label} 的待客风格，礼物重点是得体、成体系、有主次。`,
    items: [
      "建议准备 4 样左右，主礼偏长辈向，副礼偏家庭共享型。",
      "别强调花了多少钱，递礼时一句“想着第一次上门，带点心意”就够了。",
      "如果当天还有祖辈或孩子，准备要更完整，但仍然避免堆满式送礼。",
    ],
  };
}

function buildContentPack(input, style, personaLabel) {
  const firstRisk = (input.primaryStressors || [])[0] || "第一次见家长";
  return {
    shortVideoHooks: [
      `第一次见${style.label}家庭，最容易翻车的不是不会说话`,
      `${firstRisk}，到底怎么答才不显得你在硬撑`,
      `你的见家长类型是「${personaLabel}」，最危险的三个瞬间是什么`,
    ],
    socialPosts: [
      `不是讨好长辈，而是稳住分寸：${style.label}家庭第一次见面操作清单`,
      "饭后要不要抢着洗碗？很多人不是不努力，是用力方向错了",
      "被问婚期、收入、房车时，最稳的回答结构只有三步",
    ],
    privateDomainOpen:
      "我看了你的这次场景，先给你拆出最危险的 3 个瞬间，再按家庭风格给你一版当天作战卡和礼物组合。",
  };
}

function buildKnowledgeRecommendations(input) {
  const selected = knowledgeCards.slice();
  if ((input.primaryStressors || []).includes("怕礼数拿捏不准")) {
    selected.unshift({
      title: "先观察，再决定表现强度",
      bullets: ["一开始别抢节奏", "先看谁主导场面", "先接住善意，再表达自己"],
    });
  }
  return selected.slice(0, 3).map((card) => ({
    title: card.title,
    bullets: card.bullets,
  }));
}

function buildSimulationPrompts(input) {
  return [
    "模拟对方父母问：你们打算什么时候结婚？",
    "模拟饭桌上长辈一直夹菜、你已经吃不下了，怎么接更稳？",
    (input.primaryStressors || []).includes("怕被问收入/房车")
      ? "模拟被问收入、房车与未来规划，练习三步回答法。"
      : "模拟第一次冷场后的接话，练习把话题拉回共同信息。",
  ];
}

function generateCopilotResponse(input) {
  const style = resolveFamilyStyle(input.familyStyle);
  const risk = decideRiskLevel(input);
  const personaLabel = inferPersona(input, risk.level);
  const topRisks = buildRiskItems(input, style);
  const alignment = buildAlignment(input, style);
  const giftPlan = buildGiftPlan(input, style);

  return {
    heroTitle: `这次见面先别拼表现，先按 ${style.label} 场景稳住节奏`,
    heroSummary: `你当前属于「${personaLabel}」，这次的关键不是更努力，而是把礼数、边界和情侣协同压到同一条线上。`,
    riskLevel: risk.level,
    riskScore: risk.score,
    personaLabel,
    topRisks,
    battlePlan: buildBattlePlan(input, style),
    alignmentSummary: alignment.summary,
    alignmentActions: alignment.actions,
    giftPlan,
    contentPack: buildContentPack(input, style, personaLabel),
    knowledgeRecommendations: buildKnowledgeRecommendations(input),
    simulationPrompts: buildSimulationPrompts(input),
  };
}

module.exports = {
  generateCopilotResponse,
};
