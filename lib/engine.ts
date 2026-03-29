import {
  battlePlanSections,
  coupleQuestions,
  familyStyles,
  individualQuestions,
  insightLibrary,
  operatingPrinciples,
  riskAxisLabels,
  systemCapabilities,
} from "@/lib/content";
import {
  BattlePlan,
  BattlePlanSection,
  CoupleAnswer,
  CoupleInput,
  CoupleResult,
  FamilyStyle,
  FollowUpStep,
  GeneratedContentPack,
  IndividualAnswer,
  IndividualInput,
  IndividualResult,
  Question,
  RiskAxis,
  RiskLens,
  SocialContentItem,
  StyleKey,
  SystemSection,
} from "@/lib/types";

const defaultAxisScore = (): Record<RiskAxis, number> => ({
  etiquette: 0,
  boundaries: 0,
  empathy: 0,
  coordination: 0,
  resilience: 0,
});

const addScore = (
  current: Record<RiskAxis, number>,
  axes: RiskAxis[],
  amount: number,
) => {
  axes.forEach((axis) => {
    current[axis] += amount;
  });
};

const getPreferredOption = (question: Question) =>
  question.options.find((option) => option.weight === 3) ?? question.options[0];

const resolveFamilyStyle = (styleKey: StyleKey): FamilyStyle =>
  familyStyles.find((style) => style.key === styleKey) ?? familyStyles[0];

export const buildDemoIndividualAnswers = (
  path: "male" | "female",
): IndividualAnswer[] =>
  individualQuestions
    .filter((question) => question.path === path || question.path === "shared")
    .map((question) => ({
      questionId: question.id,
      optionId: getPreferredOption(question).id,
    }));

export const buildDemoCoupleAnswers = (): CoupleAnswer[] =>
  coupleQuestions.map((question, index) => ({
    questionId: question.id,
    selfOptionId:
      question.options[index % question.options.length]?.id ?? question.options[0].id,
    partnerOptionId:
      question.options[(index + 1) % question.options.length]?.id ??
      question.options[0].id,
  }));

const scoreIndividualAnswers = (answers: IndividualAnswer[]) => {
  const scores = defaultAxisScore();
  const behavioralSignals: Record<string, number> = {
    overplay: 0,
    stable: 0,
    restrained: 0,
    defensive: 0,
    overcompensating: 0,
  };

  answers.forEach((answer) => {
    const question = individualQuestions.find((item) => item.id === answer.questionId);
    const option = question?.options.find((item) => item.id === answer.optionId);

    if (!question || !option) {
      return;
    }

    addScore(scores, question.axes, option.weight);
    behavioralSignals[option.signal] = (behavioralSignals[option.signal] ?? 0) + 1;
  });

  return { scores, behavioralSignals };
};

const scoreCoupleAnswers = (answers: CoupleAnswer[]) => {
  const scores = defaultAxisScore();
  const tensions: string[] = [];
  const alignmentByQuestion = answers.map((answer) => {
    const question = coupleQuestions.find((item) => item.id === answer.questionId);
    if (!question) {
      return {
        questionId: answer.questionId,
        alignment: 0,
        label: answer.questionId,
      };
    }

    const selfOption = question.options.find((item) => item.id === answer.selfOptionId);
    const partnerOption = question.options.find(
      (item) => item.id === answer.partnerOptionId,
    );

    const alignment = selfOption?.id === partnerOption?.id ? 3 : 1;
    const base = Math.min(selfOption?.weight ?? 1, partnerOption?.weight ?? 1);
    addScore(scores, question.axes, base);

    if (alignment === 1) {
      tensions.push(question.prompt);
    }

    return {
      questionId: question.id,
      alignment,
      label: question.shortLabel,
    };
  });

  return { scores, tensions, alignmentByQuestion };
};

const pickTopAxes = (scores: Record<RiskAxis, number>, count = 2) =>
  Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([axis]) => axis as RiskAxis);

const pickBottomAxes = (scores: Record<RiskAxis, number>, count = 2) =>
  Object.entries(scores)
    .sort((a, b) => a[1] - b[1])
    .slice(0, count)
    .map(([axis]) => axis as RiskAxis);

const resolveLens = (
  signals: Record<string, number>,
  weakestAxes: RiskAxis[],
): RiskLens => {
  const highestSignal = Object.entries(signals).sort((a, b) => b[1] - a[1])[0]?.[0];

  if (highestSignal === "overplay") {
    return {
      key: "warm-overdrive",
      title: "热情过满型",
      summary: "诚意很足，但容易过度表现，抢在场景前面。",
      tone: "把主动做成自然，不要把认真做成冒进。",
    };
  }

  if (highestSignal === "restrained") {
    return {
      key: "guarded-sincere",
      title: "真诚拘谨型",
      summary: "你不失礼，但容易在关键节点显得过于安静。",
      tone: "减少自我审查，学会用一句自然的话接住场面。",
    };
  }

  if (highestSignal === "defensive") {
    return {
      key: "hard-shield",
      title: "临场硬撑型",
      summary: "敏感问题里容易急着立住自己，反而失去松弛感。",
      tone: "先接住对方的关心，再说事实和节奏，不急于证明。",
    };
  }

  if (weakestAxes.includes("coordination")) {
    return {
      key: "solo-performer",
      title: "配合失焦型",
      summary: "你个人表现不差，但容易忽略和伴侣的同频配合。",
      tone: "这不是单人秀，所有关键问题都要先和伴侣对齐。",
    };
  }

  return {
    key: "steady-poise",
    title: "稳中有礼型",
    summary: "你的稳定感和礼数感较强，整体容易留下成熟印象。",
    tone: "保持自然观察和低调配合，不需要额外加戏。",
  };
};

const buildHighRiskMoments = (
  weakestAxes: RiskAxis[],
  questions: Question[],
): string[] =>
  questions
    .filter((question) => question.axes.some((axis) => weakestAxes.includes(axis)))
    .slice(0, 3)
    .map((question) => question.prompt);

const buildRecommendations = (
  strongestAxes: RiskAxis[],
  weakestAxes: RiskAxis[],
): string[] => {
  const recommendations: string[] = [];

  weakestAxes.forEach((axis) => {
    recommendations.push(
      `重点补 ${riskAxisLabels[axis]}：${insightLibrary[axis][0] ?? "保持真诚与分寸。"}`,
    );
  });

  strongestAxes.forEach((axis) => {
    recommendations.push(`继续发挥 ${riskAxisLabels[axis]}：${insightLibrary[axis][1]}`);
  });

  return recommendations.slice(0, 4);
};

const buildFollowUpSteps = (
  sections: BattlePlanSection[],
  style: FamilyStyle,
): FollowUpStep[] =>
  sections.map((section, index) => ({
    title: section.title,
    timing: index === 0 ? "见面前" : index === sections.length - 1 ? "见面后" : "当天",
    detail: `${section.items[0]} 围绕 ${style.name} 的家庭节奏调整表达。`,
  }));

const chooseSectionsForStyle = (style: FamilyStyle): BattlePlanSection[] =>
  battlePlanSections.map((section) => ({
    ...section,
    items: [
      ...section.items,
      `针对${style.name}重点注意：${style.guidance}`,
    ].slice(0, 4),
  }));

export const evaluateIndividual = (input: IndividualInput): IndividualResult => {
  const { scores, behavioralSignals } = scoreIndividualAnswers(input.answers);
  const strongestAxes = pickTopAxes(scores);
  const weakestAxes = pickBottomAxes(scores);
  const questions = individualQuestions.filter(
    (question) => question.path === input.path || question.path === "shared",
  );
  const style = resolveFamilyStyle(input.familyStyle);
  const lens = resolveLens(behavioralSignals, weakestAxes);
  const highRiskMoments = buildHighRiskMoments(weakestAxes, questions);
  const planSections = chooseSectionsForStyle(style);

  return {
    lens,
    strongestAxes,
    weakestAxes,
    scoreByAxis: scores,
    highRiskMoments,
    recommendations: buildRecommendations(strongestAxes, weakestAxes),
    followUpSteps: buildFollowUpSteps(planSections, style),
    styleSummary: `${style.name}通常重视${style.focus.join("、")}，建议维持“真诚但不过界”的节奏。`,
  };
};

const buildAlignmentSummary = (
  scoreByAxis: Record<RiskAxis, number>,
  tensions: string[],
): string => {
  const strongest = pickTopAxes(scoreByAxis, 1)[0];
  if (tensions.length === 0) {
    return `你们在${riskAxisLabels[strongest]}上配合度较高，适合用“主次分工”而不是“同时发力”的方式出场。`;
  }

  return `你们有${tensions.length}处明显口径分歧，最需要先统一的是${tensions[0]}。`;
};

export const evaluateCouple = (input: CoupleInput): CoupleResult => {
  const { scores, tensions, alignmentByQuestion } = scoreCoupleAnswers(input.answers);
  const strongestAxes = pickTopAxes(scores);
  const weakestAxes = pickBottomAxes(scores);
  const style = resolveFamilyStyle(input.familyStyle);

  return {
    alignmentSummary: buildAlignmentSummary(scores, tensions),
    strongestAxes,
    weakestAxes,
    scoreByAxis: scores,
    topMisalignments:
      tensions.length > 0
        ? tensions.slice(0, 3)
        : [
            "你们暂时没有高冲突项，可以把注意力放在现场分工而不是继续拉扯观点。",
          ],
    recommendedRoles: [
      "更稳定的一方负责开场和敏感问题的第一句话。",
      "更松弛的一方负责在冷场时补充日常话题。",
      `遇到${style.name}的家庭节奏时，优先保持“先观察、再进入”的默契。`,
    ],
    synchronizedScripts: [
      "婚期问题：先说“我们在认真规划”，再补时间窗口，不抢先定死。",
      "工作城市问题：先表达双方正在协调，再说明当下阶段。",
      "买房问题：先说现状与节奏，不说超出掌控的承诺。",
    ],
    rehearsalPrompts: alignmentByQuestion
      .filter((item) => item.alignment < 3)
      .slice(0, 3)
      .map(
        (item) =>
          `围绕「${item.label}」做一次角色扮演：一人回答，一人负责补位收口。`,
      ),
  };
};

const buildPersonalizedSection = (
  section: BattlePlanSection,
  style: FamilyStyle,
  result: IndividualResult,
): BattlePlanSection => {
  const weakestLabel = riskAxisLabels[result.weakestAxes[0] ?? "boundaries"];

  return {
    ...section,
    items: [
      ...section.items,
      `结合你的弱项「${weakestLabel}」，这一阶段尽量少做超前表现。`,
      `围绕 ${style.name} 的家庭风格，优先照顾 ${style.focus[0]} 的感受。`,
    ].slice(0, 4),
  };
};

export const generateBattlePlan = (
  input: IndividualInput,
  result: IndividualResult,
): BattlePlan => {
  const style = resolveFamilyStyle(input.familyStyle);
  const sections = battlePlanSections.map((section) =>
    buildPersonalizedSection(section, style, result),
  );

  return {
    title: `给 ${input.userName || "你"} 的当天作战方案`,
    summary: `${style.name} | ${input.stage} | 在场人：${input.attendees.join("、")}。重点是稳住${riskAxisLabels[result.weakestAxes[0] ?? "boundaries"]}，把表现做轻。`,
    sections,
    reminders: [
      "不要急着证明自己，先接住场子。",
      "涉及婚期、房车、城市等敏感题，先说双方在认真规划。",
      "见后当天发一条简短感谢，别刷屏式复盘。",
    ],
  };
};

const socialTemplates = [
  {
    title: "第一次见家长最容易翻车的，不是不会说话",
    hook: "而是太急着证明自己。",
  },
  {
    title: "阿姨说“来就来还买什么”时，千万别这样接",
    hook: "一句话就能看出你是自然还是用力过猛。",
  },
  {
    title: "饭后要不要抢着洗碗？很多人输在这里",
    hook: "不是不帮忙，而是帮到什么程度最稳。",
  },
];

export const generateContentPack = (
  input: IndividualInput,
  result: IndividualResult,
  battlePlan: BattlePlan,
): GeneratedContentPack => {
  const style = resolveFamilyStyle(input.familyStyle);

  const socialPosts: SocialContentItem[] = socialTemplates.map((template, index) => ({
    channel: index === 0 ? "short-video" : index === 1 ? "social-post" : "search-snippet",
    title: template.title,
    hook: template.hook,
    outline: [
      `场景设定：${style.name} / ${input.stage}`,
      `高危点：${result.highRiskMoments[index] ?? result.highRiskMoments[0]}`,
      `解决方式：${battlePlan.sections[index]?.items[0] ?? battlePlan.reminders[0]}`,
    ],
    cta: "点开测评，拿到你的当天作战方案。",
  }));

  return {
    messageToUser: `${input.userName || "你"}当前最需要的是：少解释，多观察；少逞强，多配合。`,
    socialPosts,
    crmSequence: [
      `D0：发送「${battlePlan.title}」摘要 + 结果画像`,
      "D1：推送高危问题回答脚本",
      "D3：推送礼物建议与节奏提醒",
      "D7：如果已见完，触发复盘与下一次往来建议",
    ],
  };
};

export const buildSystemSections = (): SystemSection[] => [
  {
    title: "超级入口",
    description:
      "用户只需回答少量问题，系统自动判断应该进入个人准备、情侣协同还是当天作战方案。",
    bullets: [
      "支持结构化输入与自由文本补充",
      "自动识别时间紧迫度、家庭风格、敏感话题和协同风险",
      "一套入口触发所有后续能力",
    ],
  },
  {
    title: "能力底座",
    description: "把内容、规则、评分、建议和社媒自动化全部挂在同一底座上。",
    bullets: systemCapabilities,
  },
  {
    title: "运营原则",
    description: "不压缩能力，只压缩用户前台的复杂度。",
    bullets: operatingPrinciples,
  },
];
