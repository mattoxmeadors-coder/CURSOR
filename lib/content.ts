import type {
  ChoiceState,
  FamilyStyleOption,
  KnowledgeCard,
  OperationBlueprintItem,
  SelectOption,
  SocialAutomationItem,
  ParentBackgroundId,
  RelationStageId,
} from "@/lib/types";

export const familyStyles: FamilyStyleOption[] = [
  {
    id: "north-ritual",
    label: "北方礼数型",
    description: "更看重礼貌、顺序和整体分寸感，第一次见面尤其在意稳妥表现。",
    focus: ["称呼", "礼物结构", "餐桌顺序"],
    giftTone: "礼物宜成双、结构清楚、不过满。",
    scriptTone: "语气谦和，先接住再表达。",
  },
  {
    id: "northeast-warm",
    label: "东北热情型",
    description: "氛围热络、互动直接，容易快速进入聊天、夹菜和敬酒场景。",
    focus: ["接话能力", "饭桌节奏", "热情中的边界"],
    giftTone: "礼物不必花哨，但要显得敞亮体面。",
    scriptTone: "自然接话、别装熟、别硬拒。",
  },
  {
    id: "jiangzhe-refined",
    label: "江浙沪精致型",
    description: "更重细节、节奏与边界，礼物、谈吐和状态都容易被观察。",
    focus: ["细节感", "边界感", "生活规划表达"],
    giftTone: "选择有品质感、整洁克制的组合。",
    scriptTone: "不夸口，不抢话，表达清楚。",
  },
  {
    id: "south-pragmatic",
    label: "两广务实型",
    description: "偏务实，会看真实度、稳定度和长期打算，不喜欢空话。",
    focus: ["稳定感", "实际规划", "说到做到"],
    giftTone: "实用型、适合家庭使用的礼盒更稳。",
    scriptTone: "真实具体，少空承诺。",
  },
  {
    id: "chaoshan-custom",
    label: "潮汕闽南习俗型",
    description: "更看重称呼、礼物、长辈顺序和场面礼节，习俗感相对更强。",
    focus: ["长辈次序", "称呼礼数", "礼物规整"],
    giftTone: "礼物和数量要更讲究，不可太随意。",
    scriptTone: "尊重长辈、留意顺序，不乱抢表达。",
  },
  {
    id: "sichuan-relaxed",
    label: "川渝松弛型",
    description: "整体氛围可能轻松热情，但仍重视真诚、会接话和情绪稳定。",
    focus: ["聊天松弛度", "饭桌配合", "不端着"],
    giftTone: "自然大方即可，不必过度包装。",
    scriptTone: "轻松但别油滑，真诚最重要。",
  },
  {
    id: "central-balanced",
    label: "华中均衡型",
    description: "礼数与日常感并重，不求夸张表现，更看重是否自然得体。",
    focus: ["自然感", "基础礼数", "家庭融入感"],
    giftTone: "平衡型礼物组合最合适。",
    scriptTone: "稳、顺、自然，不需要硬撑。",
  },
  {
    id: "city-modern",
    label: "一线城市简化型",
    description: "礼数要求相对简化，但边界感、沟通感和生活规划表达更重要。",
    focus: ["表达清晰", "边界感", "协同感"],
    giftTone: "简洁、得体、有品质即可。",
    scriptTone: "像成熟成年人沟通，不要表演。",
  },
];

export const parentBackgrounds: SelectOption<ParentBackgroundId>[] = [
  { id: "system", label: "体制内" },
  { id: "business", label: "经商" },
  { id: "salaried", label: "工薪" },
  { id: "agriculture", label: "农业/家族式务实" },
  { id: "professional", label: "学术/教师/医护等专业型" },
];

export const relationStages: SelectOption<RelationStageId>[] = [
  { id: "first-visit", label: "初次登门" },
  { id: "serious-meeting", label: "正式相见" },
  { id: "marriage-discussion", label: "婚事考察/讨论" },
  { id: "holiday-visit", label: "节日走动" },
  { id: "engagement", label: "准备订亲/定事" },
];

export const yesNoAnswers: SelectOption<ChoiceState>[] = [
  { id: "yes", label: "是" },
  { id: "partial", label: "部分统一 / 不完全确定" },
  { id: "no", label: "还没有" },
];

export const knowledgeCards: KnowledgeCard[] = [
  {
    title: "第一次见面，先稳住这三件事",
    bullets: ["称呼先用叔叔/阿姨", "礼物不强调价格，重在得体", "先观察节奏，再决定表现强度"],
  },
  {
    title: "真正容易失分的，不是不会说话",
    bullets: ["抢着表现不一定加分", "过度拘谨也会让气氛掉下去", "最稳的是先表达，再看对方节奏"],
  },
  {
    title: "饭桌上最值钱的是舒服感",
    bullets: ["长辈先动，你再进入节奏", "不想吃、不能喝都能礼貌表达", "稳定比嘴甜更重要"],
  },
];

export const singleKnowledgeCards = knowledgeCards;

export const operationsBlueprint: OperationBlueprintItem[] = [
  {
    id: "01",
    title: "智能诊断层",
    description: "先识别家庭风格、见面性质、压力源和协同状态，而不是直接丢一堆题。",
  },
  {
    id: "02",
    title: "动态画像层",
    description: "把用户归纳成可执行的行为画像，例如热情过满、真诚拘谨、临场硬撑。",
  },
  {
    id: "03",
    title: "当天作战层",
    description: "按见面前、进门、饭桌、敏感问题、收尾五段式输出可执行动作。",
  },
  {
    id: "04",
    title: "情侣协同层",
    description: "先统一口径，再建议谁开场、谁补位、谁负责高压问题收口。",
  },
  {
    id: "05",
    title: "礼物与准备层",
    description: "把家庭风格、预算和场景联动，不做死板推荐。",
  },
  {
    id: "06",
    title: "模拟演练层",
    description: "预留长辈角色扮演、敏感问题练习和回答重写接口。",
  },
  {
    id: "07",
    title: "运营自动化层",
    description: "同一份风险画像自动派生短视频标题、图文选题和私域开场话术。",
  },
];

export const socialAutomation: SocialAutomationItem[] = [
  {
    title: "短视频钩子自动生成",
    description: "基于高危场景和用户画像，自动拆成有点击欲的内容标题。",
  },
  {
    title: "图文选题自动派生",
    description: "把风险瞬间、礼物建议和协同问题转换成搜索向内容。",
  },
  {
    title: "评论区高频回复模板",
    description: "对“要不要洗碗”“被问婚期怎么办”等高频问题沉淀标准答法。",
  },
  {
    title: "私域首条消息编排",
    description: "将本次画像直接转成更像顾问服务的欢迎消息与跟进路径。",
  },
];

