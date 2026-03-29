import {
  AnswerOption,
  CoupleDimension,
  FamilyStyle,
  KnowledgeCard,
  PersonaType,
  PlanSection,
  Question,
  QuestionFlow,
  RoleType,
  VisitContext,
  VisitStage,
} from "@/lib/types";

const makeOption = (
  id: string,
  label: string,
  scoreDelta: Partial<Record<string, number>>,
  signals: string[],
  rationale: string,
): AnswerOption => ({
  id,
  label,
  scoreDelta,
  signals,
  rationale,
});

export const familyStyles: { id: FamilyStyle; title: string; summary: string }[] = [
  {
    id: "north-ritual",
    title: "北方礼数型",
    summary: "看重礼貌、顺序和整体分寸感，重视第一次见面的稳妥表现。",
  },
  {
    id: "northeast-warm",
    title: "东北热情型",
    summary: "氛围热络、互动直接，容易出现敬酒、热情夹菜和快速熟络场景。",
  },
  {
    id: "jiangzhe-refined",
    title: "江浙沪精致型",
    summary: "更重细节、节奏和边界，礼物、谈吐与场面感很重要。",
  },
  {
    id: "south-pragmatic",
    title: "两广务实型",
    summary: "注重务实与家庭观念，表达通常不夸张，但会观察稳定度和真诚度。",
  },
  {
    id: "chaoshan-custom",
    title: "潮汕闽南习俗型",
    summary: "更在意称呼、礼物和长辈次序，重视习俗与尊重感。",
  },
  {
    id: "sichuan-relaxed",
    title: "川渝松弛型",
    summary: "气氛可能轻松热情，但仍然看重真诚、接话能力和临场稳定。",
  },
  {
    id: "central-balanced",
    title: "华中均衡型",
    summary: "礼数与日常感并重，不求过度表现，更看重是否自然得体。",
  },
  {
    id: "city-modern",
    title: "一线城市简化型",
    summary: "礼数要求可能简化，但边界感、沟通感和生活规划表达更重要。",
  },
];

export const singleKnowledgeCards: KnowledgeCard[] = [
  {
    id: "kc-01",
    title: "第一次见面，先稳住这三件事",
    bullets: ["称呼先用叔叔/阿姨", "礼物别强调价格，重在得体", "先观察节奏，再决定表现强度"],
    useAtQuestion: 5,
  },
  {
    id: "kc-02",
    title: "真正容易失分的，不是不会说话",
    bullets: ["抢着表现不一定加分", "过度拘谨也会让气氛掉下去", "最稳的是先表达，再看对方节奏"],
    useAtQuestion: 12,
  },
  {
    id: "kc-03",
    title: "饭桌上最值钱的是舒服感",
    bullets: ["长辈先动，你再进入节奏", "不想吃、不能喝都能礼貌表达", "稳定比嘴甜更重要"],
    useAtQuestion: 20,
  },
];

const commonQuestions: Question[] = [
  {
    id: "c-1",
    role: "common",
    prompt: "第一次见面，最稳妥的称呼是？",
    scene: "opening",
    dimensions: ["ritual", "boundaries"],
    options: [
      makeOption("a", "叔叔 / 阿姨", { ritual: 3, boundaries: 2 }, ["stable"], "第一次见面先使用最稳妥称呼，兼顾礼貌与分寸。"),
      makeOption("b", "爸 / 妈", { boundaries: -3 }, ["overeager"], "过早拉近称呼会显得抢节奏。"),
      makeOption("c", "老师 / 领导式称呼", { empathy: -1 }, ["stiff"], "过度正式会显得疏离，不像家庭场景。"),
    ],
  },
  {
    id: "c-2",
    role: "common",
    prompt: "路上堵车，发现自己会迟到 10 分钟，你怎么处理更稳？",
    scene: "preparation",
    dimensions: ["adaptability", "coordination"],
    options: [
      makeOption("a", "一确定会迟到就提前说明，到门口再补一句抱歉", { adaptability: 3, coordination: 2 }, ["stable"], "提前说明比到场解释更稳。"),
      makeOption("b", "到了再说路上堵车", { adaptability: -2 }, ["avoidant"], "延后说明会放大被动感。"),
      makeOption("c", "假装没迟到过", { boundaries: -2, empathy: -2 }, ["hard"], "忽略这件事会让礼数感掉分。"),
    ],
  },
  {
    id: "c-3",
    role: "common",
    prompt: "刚坐下手机响了，怎么处理更稳？",
    scene: "opening",
    dimensions: ["ritual", "boundaries"],
    options: [
      makeOption("a", "看一眼挂断或静音，并简单致歉", { ritual: 2, boundaries: 2 }, ["stable"], "处理手机越简洁越像有场合感。"),
      makeOption("b", "当场接起来说我很快", { boundaries: -3 }, ["overeager"], "把外部事务带入第一次见面很减分。"),
      makeOption("c", "不看也不处理，让它一直震", { adaptability: -2 }, ["avoidant"], "放任打断会让在场人更不舒服。"),
    ],
  },
  {
    id: "c-4",
    role: "common",
    prompt: "突然冷场，你怎么接更自然？",
    scene: "table",
    dimensions: ["adaptability", "empathy"],
    options: [
      makeOption("a", "回到共同信息：路程、菜、节日、家常", { adaptability: 3, empathy: 1 }, ["stable"], "共同信息最容易让对话重新流动。"),
      makeOption("b", "强行讲段子活跃气氛", { boundaries: -2 }, ["overeager"], "硬活跃容易跑偏。"),
      makeOption("c", "低头玩手机", { empathy: -3 }, ["avoidant"], "直接退出场域最伤气氛。"),
    ],
  },
  {
    id: "c-5",
    role: "common",
    prompt: "桌上有你不习惯的菜，你更稳的是？",
    scene: "table",
    dimensions: ["boundaries", "ritual"],
    options: [
      makeOption("a", "少量尝一点，不点评口味轻重", { boundaries: 2, ritual: 2 }, ["stable"], "接受善意但不制造评价，是最稳处理。"),
      makeOption("b", "直接说自己吃不来", { empathy: -2 }, ["hard"], "过于直接会让主家尴尬。"),
      makeOption("c", "硬吃到明显难受", { boundaries: -2 }, ["people-pleasing"], "讨好到失衡并不高级。"),
    ],
  },
  {
    id: "c-6",
    role: "common",
    prompt: "主人说随便坐，但你分不清哪个位置更合适，怎么办？",
    scene: "opening",
    dimensions: ["ritual", "adaptability"],
    options: [
      makeOption("a", "等长辈先坐，或轻问一句我坐这边合适吗", { ritual: 3, adaptability: 1 }, ["stable"], "主动确认比自作主张更稳妥。"),
      makeOption("b", "先抢一个最舒服的位置", { ritual: -3 }, ["overeager"], "容易显得没观察场合。"),
      makeOption("c", "一直站着不坐", { adaptability: -2 }, ["stiff"], "过度拘谨会让大家更不自在。"),
    ],
  },
  {
    id: "c-7",
    role: "common",
    prompt: "长辈一直给你夹菜，你已经吃不动了，怎么收？",
    scene: "table",
    dimensions: ["ritual", "adaptability"],
    options: [
      makeOption("a", "感谢后及时说明真的够了，您别忙", { ritual: 3, adaptability: 2 }, ["stable"], "接住善意再温和表达边界是最好的。"),
      makeOption("b", "硬撑着全吃", { boundaries: -2 }, ["people-pleasing"], "过度迎合会让自己和场面都变累。"),
      makeOption("c", "一直放着不动", { ritual: -2 }, ["avoidant"], "让长辈的善意悬空会失礼。"),
    ],
  },
  {
    id: "c-8",
    role: "common",
    prompt: "有人半开玩笑问：以后你们家谁说了算？",
    scene: "sensitive",
    dimensions: ["coordination", "empathy"],
    options: [
      makeOption("a", "笑着说我们会一起商量，也会多听长辈经验", { coordination: 3, empathy: 2 }, ["stable"], "既不硬碰，也不把伴侣推出去。"),
      makeOption("b", "当然我说了算", { coordination: -3 }, ["hard"], "玩笑中也会暴露控制感。"),
      makeOption("c", "立刻把伴侣推出来回答", { coordination: -2 }, ["avoidant"], "在高压问题上甩给对方会让配合度掉分。"),
    ],
  },
  {
    id: "c-9",
    role: "common",
    prompt: "遇到邻居或父母朋友临时加入，对你问东问西，怎么办？",
    scene: "sensitive",
    dimensions: ["boundaries", "adaptability"],
    options: [
      makeOption("a", "礼貌简答，不展开太深，再把话题收回来", { boundaries: 3, adaptability: 1 }, ["stable"], "既不失礼，也能守住边界。"),
      makeOption("b", "什么都往外讲", { boundaries: -3 }, ["people-pleasing"], "过度敞开会埋下后续被动。"),
      makeOption("c", "明显不耐烦", { empathy: -3 }, ["hard"], "第一次见面最忌讳情绪外露。"),
    ],
  },
  {
    id: "c-10",
    role: "common",
    prompt: "回家后要不要单独发感谢消息？",
    scene: "follow-up",
    dimensions: ["ritual", "coordination"],
    options: [
      makeOption("a", "要，简短就好，不刷屏", { ritual: 2, coordination: 1 }, ["stable"], "一个简洁的感谢就是完整收尾。"),
      makeOption("b", "不需要，见完就完了", { ritual: -2 }, ["avoidant"], "缺少收尾动作会让好印象不完整。"),
      makeOption("c", "立刻发一大段长文复盘", { boundaries: -1 }, ["overeager"], "过满的感谢会让关系显得不自然。"),
    ],
  },
];

const maleQuestions: Question[] = [
  {
    id: "m-1",
    role: "male",
    prompt: "第一次进门，阿姨笑着说：来就来，买什么东西。你怎么接更稳？",
    scene: "opening",
    dimensions: ["ritual", "adaptability"],
    options: [
      makeOption("a", "一点心意，不知道您喜欢什么，您别嫌弃", { ritual: 3, adaptability: 1 }, ["stable"], "接话谦和，既不夸也不缩。"),
      makeOption("b", "没花多少钱，随便买的", { ritual: -2 }, ["stiff"], "把心意说轻了，反而显得不会接。"),
      makeOption("c", "这是我爸妈让我一定带的", { coordination: -1 }, ["avoidant"], "把主动权推出去会减弱个人稳感。"),
    ],
  },
  {
    id: "m-2",
    role: "male",
    prompt: "第一次正式登门，预算有限，哪种礼物组合更稳？",
    scene: "preparation",
    dimensions: ["ritual", "boundaries"],
    options: [
      makeOption("a", "4样有主次、成双，实用为主", { ritual: 2, boundaries: 2 }, ["stable"], "预算有限也能做出稳妥结构。"),
      makeOption("b", "1个很贵的大牌礼盒", { boundaries: -1 }, ["overeager"], "过度单点昂贵容易失衡。"),
      makeOption("c", "一口气买8样堆满", { boundaries: -3 }, ["people-pleasing"], "用力过猛很像在补不安。"),
    ],
  },
  {
    id: "m-3",
    role: "male",
    prompt: "对方父亲递烟，但你平时不抽，怎么处理更得体？",
    scene: "table",
    dimensions: ["ritual", "adaptability"],
    options: [
      makeOption("a", "微笑谢过，说平时不抽，但陪叔叔坐会儿", { ritual: 3, adaptability: 2 }, ["stable"], "接住善意又表达边界。"),
      makeOption("b", "硬接一根，装作会抽", { boundaries: -2 }, ["people-pleasing"], "假装熟练最容易失控。"),
      makeOption("c", "直接说我不抽，别给我了", { empathy: -2 }, ["hard"], "事实没错，但太硬。"),
    ],
  },
  {
    id: "m-4",
    role: "male",
    prompt: "被问你现在做什么工作，收入大概怎么样，怎么答更好？",
    scene: "sensitive",
    dimensions: ["adaptability", "coordination"],
    options: [
      makeOption("a", "如实说区间、稳定性，再补一句自己的规划", { adaptability: 3, coordination: 1 }, ["stable"], "真实且有方向感最能建立可靠度。"),
      makeOption("b", "往高了说，先把面子撑住", { coordination: -2 }, ["hard"], "逞强型回答会被后续问题放大。"),
      makeOption("c", "够花就行，没必要细说吧", { empathy: -2 }, ["hard"], "防御感太强。"),
    ],
  },
  {
    id: "m-5",
    role: "male",
    prompt: "女友妈妈在厨房忙，女友已经进去帮忙了，你更稳的动作是？",
    scene: "after-meal",
    dimensions: ["boundaries", "empathy"],
    options: [
      makeOption("a", "先问有没有我能搭把手的，需要再做外圈活", { boundaries: 3, empathy: 1 }, ["stable"], "既表达愿意，也不闯入过深。"),
      makeOption("b", "直接冲进厨房接手", { boundaries: -3 }, ["overeager"], "第一次就深入核心空间容易太满。"),
      makeOption("c", "坐着等吃饭，假装看不见", { empathy: -3 }, ["avoidant"], "缺少基本的参与感。"),
    ],
  },
  {
    id: "m-6",
    role: "male",
    prompt: "对方父亲单独问你：你打算以后怎么照顾她？",
    scene: "sensitive",
    dimensions: ["coordination", "empathy"],
    options: [
      makeOption("a", "说具体做法：沟通、规划、尊重她的发展", { coordination: 3, empathy: 2 }, ["stable"], "具体比口号更有可信度。"),
      makeOption("b", "您放心，我肯定不会亏待她", { coordination: -1 }, ["stiff"], "态度有了，但太空。"),
      makeOption("c", "这个还得看她怎么想", { coordination: -2 }, ["avoidant"], "把责任推空会显得不稳。"),
    ],
  },
  {
    id: "m-7",
    role: "male",
    prompt: "有人问你们打算什么时候结婚，你怎么答更稳？",
    scene: "sensitive",
    dimensions: ["coordination", "adaptability"],
    options: [
      makeOption("a", "给阶段性说法，不替两个人单方面拍板", { coordination: 3, adaptability: 1 }, ["stable"], "既回应期待，又保留双方共识。"),
      makeOption("b", "直接替两人定具体时间", { coordination: -3 }, ["overeager"], "容易让伴侣被动。"),
      makeOption("c", "再说吧，现在谁知道", { empathy: -2 }, ["avoidant"], "把气氛打散。"),
    ],
  },
  {
    id: "m-8",
    role: "male",
    prompt: "她和父母聊着聊着出现意见不一致，你更稳的做法是？",
    scene: "sensitive",
    dimensions: ["coordination", "boundaries"],
    options: [
      makeOption("a", "不当场裁判，先稳住气氛，私下再和她统一", { coordination: 3, boundaries: 2 }, ["stable"], "临场不抢站位，才是真稳。"),
      makeOption("b", "当场明显站她那边", { boundaries: -2 }, ["overeager"], "好意可能会放大对立。"),
      makeOption("c", "当场明显站她父母那边", { coordination: -3 }, ["hard"], "会直接伤到伴侣配合感。"),
    ],
  },
  {
    id: "m-9",
    role: "male",
    prompt: "饭后你要不要主动收拾？",
    scene: "after-meal",
    dimensions: ["boundaries", "ritual"],
    options: [
      makeOption("a", "主动表达愿意帮忙，但按对方安排做边缘工作", { boundaries: 3, ritual: 1 }, ["stable"], "稳在愿意和分寸同时在线。"),
      makeOption("b", "直接抢着洗碗收台，表现自己", { boundaries: -2 }, ["overeager"], "太像在证明自己。"),
      makeOption("c", "完全不动，坐着聊天", { empathy: -2 }, ["avoidant"], "没有基本收尾参与。"),
    ],
  },
  {
    id: "m-10",
    role: "male",
    prompt: "见面结束回到家，你更该做的是？",
    scene: "follow-up",
    dimensions: ["coordination", "adaptability"],
    options: [
      makeOption("a", "当晚简短感谢 + 和女友复盘细节", { coordination: 3, adaptability: 1 }, ["stable"], "收尾和配合一起完成。"),
      makeOption("b", "立刻发很长一段表现汇报", { boundaries: -1 }, ["overeager"], "太像做作业汇报。"),
      makeOption("c", "事情过去就算了，不再回应", { ritual: -2 }, ["avoidant"], "缺少基本闭环。"),
    ],
  },
];

const femaleQuestions: Question[] = [
  {
    id: "f-1",
    role: "female",
    prompt: "第一次去他家，哪种穿搭最稳？",
    scene: "preparation",
    dimensions: ["ritual", "boundaries"],
    options: [
      makeOption("a", "干净得体、略正式、方便行动", { ritual: 2, boundaries: 2 }, ["stable"], "让人放心又不抢戏。"),
      makeOption("b", "很抢眼、很精致、明显像赴宴展示", { boundaries: -2 }, ["overeager"], "会让第一印象偏离家庭场景。"),
      makeOption("c", "太随意，像下楼拿快递", { ritual: -3 }, ["avoidant"], "显得不重视。"),
    ],
  },
  {
    id: "f-2",
    role: "female",
    prompt: "进门换鞋时，礼物和包怎么处理更自然？",
    scene: "opening",
    dimensions: ["ritual", "boundaries"],
    options: [
      makeOption("a", "先问放哪里，礼物双手递，包尽量不占位置", { ritual: 3, boundaries: 2 }, ["stable"], "细节里最能看出场合感。"),
      makeOption("b", "礼物先放地上，自己慢慢整理", { ritual: -2 }, ["stiff"], "节奏容易被拖散。"),
      makeOption("c", "包和外套直接摊在沙发上", { boundaries: -3 }, ["overeager"], "太快把自己放进主场位置。"),
    ],
  },
  {
    id: "f-3",
    role: "female",
    prompt: "家里有爷爷奶奶在场，第一轮打招呼更稳的是？",
    scene: "opening",
    dimensions: ["ritual", "empathy"],
    options: [
      makeOption("a", "按辈分依次问候，语速放慢", { ritual: 3, empathy: 2 }, ["stable"], "尊重次序会很加分。"),
      makeOption("b", "只和男友父母打招呼", { empathy: -3 }, ["avoidant"], "容易让长辈被忽略。"),
      makeOption("c", "紧张地点个头就算过", { ritual: -2 }, ["stiff"], "显得过于缩。"),
    ],
  },
  {
    id: "f-4",
    role: "female",
    prompt: "阿姨在厨房忙，你什么时候进去帮忙更合适？",
    scene: "after-meal",
    dimensions: ["boundaries", "adaptability"],
    options: [
      makeOption("a", "先坐定寒暄，再问需不需要帮忙", { boundaries: 3, adaptability: 1 }, ["stable"], "先进入家庭节奏，再表达参与。"),
      makeOption("b", "一进门就直奔厨房", { boundaries: -3 }, ["overeager"], "太早进入私人空间。"),
      makeOption("c", "全程都不问", { empathy: -2 }, ["avoidant"], "没有基本回应。"),
    ],
  },
  {
    id: "f-5",
    role: "female",
    prompt: "被问你会做饭吗，更好的回答是？",
    scene: "sensitive",
    dimensions: ["adaptability", "boundaries"],
    options: [
      makeOption("a", "不逞强也不自贬，说会几样家常、也愿意学", { adaptability: 3, boundaries: 2 }, ["stable"], "真实和开放最舒服。"),
      makeOption("b", "我平时完全不做这个", { empathy: -2 }, ["hard"], "容易把气氛打得太实。"),
      makeOption("c", "把自己说成厨神", { boundaries: -2 }, ["hard"], "夸满了很容易露怯。"),
    ],
  },
  {
    id: "f-6",
    role: "female",
    prompt: "男友出去接电话，你单独和长辈坐着，怎么办？",
    scene: "table",
    dimensions: ["adaptability", "empathy"],
    options: [
      makeOption("a", "主动接一个轻话题，比如路程、菜、日常工作", { adaptability: 3, empathy: 1 }, ["stable"], "轻话题最适合过桥。"),
      makeOption("b", "沉默低头等他回来", { adaptability: -3 }, ["avoidant"], "压力越大越要维持基本流动。"),
      makeOption("c", "立刻给男友发消息求救", { coordination: -1 }, ["stiff"], "会暴露明显不稳。"),
    ],
  },
  {
    id: "f-7",
    role: "female",
    prompt: "被拿来和别的女生比较，你怎么接更稳？",
    scene: "sensitive",
    dimensions: ["adaptability", "boundaries"],
    options: [
      makeOption("a", "先接住话，再回到自己真实情况，不硬碰", { adaptability: 3, boundaries: 1 }, ["stable"], "不把比较升级成对抗。"),
      makeOption("b", "当场反驳，证明自己不差", { empathy: -2 }, ["hard"], "会把比较坐实。"),
      makeOption("c", "表情明显垮掉，不再参与", { adaptability: -2 }, ["avoidant"], "情绪直接掉线会让局面更难收。"),
    ],
  },
  {
    id: "f-8",
    role: "female",
    prompt: "长辈问到婚期、生育，你更稳的回答是？",
    scene: "sensitive",
    dimensions: ["coordination", "adaptability"],
    options: [
      makeOption("a", "表达双方在认真相处和规划，但不当场拍板", { coordination: 3, adaptability: 1 }, ["stable"], "既回应关心，又不替双方定案。"),
      makeOption("b", "直接给出具体时间", { coordination: -3 }, ["overeager"], "容易把伴侣和后续关系置于被动。"),
      makeOption("c", "明确顶回去，让气氛冷掉", { empathy: -2 }, ["hard"], "边界可以有，但不该用对抗方式。"),
    ],
  },
  {
    id: "f-9",
    role: "female",
    prompt: "饭后你要不要主动收碗？",
    scene: "after-meal",
    dimensions: ["boundaries", "ritual"],
    options: [
      makeOption("a", "起身表示愿意帮忙，但按对方节奏做", { boundaries: 3, ritual: 1 }, ["stable"], "有参与，不越位。"),
      makeOption("b", "直接把所有碗都端走抢着干", { boundaries: -2 }, ["overeager"], "太像刻意表现。"),
      makeOption("c", "坐着不动", { empathy: -2 }, ["avoidant"], "会显得参与度不够。"),
    ],
  },
  {
    id: "f-10",
    role: "female",
    prompt: "临走时，你更好的收尾方式是？",
    scene: "follow-up",
    dimensions: ["ritual", "empathy"],
    options: [
      makeOption("a", "感谢招待 + 表达今天很开心", { ritual: 3, empathy: 1 }, ["stable"], "完整、轻盈、不做作。"),
      makeOption("b", "今天麻烦死你们了", { ritual: -1 }, ["stiff"], "表达有感谢，但措辞偏重。"),
      makeOption("c", "只和男友说走了", { empathy: -3 }, ["avoidant"], "会让主家觉得被跳过。"),
    ],
  },
];

export const questionFlows: Record<QuestionFlow, { title: string; description: string; questions: Question[]; knowledgeCards: KnowledgeCard[] }> =
  {
    single: {
      title: "个人准备度诊断",
      description: "通过现场决策题判断你最容易翻车的节点，并生成当天作战建议。",
      questions: [...maleQuestions, ...femaleQuestions, ...commonQuestions],
      knowledgeCards: singleKnowledgeCards,
    },
    couple: {
      title: "情侣协同诊断",
      description: "识别你们在口径统一、角色分工和高压补位上的失配风险。",
      questions: [],
      knowledgeCards: [],
    },
    battlePlan: {
      title: "当天作战方案",
      description: "根据这次见面的上下文，生成准备、饭桌、敏感问题和收尾策略。",
      questions: [],
      knowledgeCards: [],
    },
  };

export const personaNarratives: Record<
  PersonaType,
  {
    title: string;
    summary: string;
    strengths: string[];
    risks: string[];
  }
> = {
  "steady-polite": {
    title: "稳中有礼型",
    summary: "你最强的是稳定和节奏感，不容易在关键时刻乱来。",
    strengths: ["礼数和分寸都在线", "能接住别人的善意", "不容易让伴侣处于被动"],
    risks: ["如果太收着，可能会略显保守", "需要在冷场时再主动一点"],
  },
  "warm-overdrive": {
    title: "热情过满型",
    summary: "你愿意表现诚意，但容易把积极做成冒进。",
    strengths: ["不容易冷场", "愿意承担气氛责任", "情感表达直接"],
    risks: ["容易抢节奏", "容易过早进入太熟的状态", "在家务和敏感问题上可能太满"],
  },
  "sincere-shy": {
    title: "真诚拘谨型",
    summary: "你不失礼，但在高压场景里容易缩住。",
    strengths: ["不乱说", "不容易越界", "基础礼貌稳定"],
    risks: ["单独对话容易卡住", "冷场时退出过快", "容易把紧张转成沉默"],
  },
  "hard-guarded": {
    title: "临场硬撑型",
    summary: "你不想掉链子，但压力一来容易把真实回答成防御或逞强。",
    strengths: ["有承担意识", "不轻易示弱", "遇到现实问题时反应快"],
    risks: ["容易说满", "容易在敏感问题上顶回去", "会让别人感到你在防守"],
  },
  "coordination-gaps": {
    title: "配合失焦型",
    summary: "你单独表现不差，但和伴侣的协同容易散掉。",
    strengths: ["个人基本分不低", "能完成大多数礼数动作", "有配合意愿"],
    risks: ["高压问题容易把伴侣推出来", "没有统一口径时会露出失配", "对现场分工不够敏感"],
  },
  "people-pleasing": {
    title: "讨好失衡型",
    summary: "你很想留下好印象，但容易为了顺利牺牲边界。",
    strengths: ["善于接住他人情绪", "愿意配合和付出", "通常不让场面变难看"],
    risks: ["容易硬撑自己不舒服", "过度表现会显得不自然", "容易在结束后仍持续焦虑补救"],
  },
};

export const planSections: PlanSection[] = [
  {
    id: "prep",
    title: "见面前 24 小时",
    goals: ["明确礼物、时间和基础口径", "确认当天角色分工", "提前准备高压问题回答框架"],
  },
  {
    id: "opening",
    title: "进门前 10 分钟",
    goals: ["处理称呼和礼物递送", "控制第一轮表达强度", "快速进入家庭节奏"],
  },
  {
    id: "table",
    title: "饭桌阶段",
    goals: ["维持舒服感和参与感", "接住长辈善意但不过界", "不在酒菜或玩笑问题上翻车"],
  },
  {
    id: "sensitive",
    title: "敏感问题阶段",
    goals: ["回答真实但不说满", "不替伴侣单方面拍板", "遇到压力时保留协商空间"],
  },
  {
    id: "follow-up",
    title: "收尾与回家后",
    goals: ["完成感谢和闭环", "与伴侣统一复盘", "为下次往来保留自然感"],
  },
];

export const aiSystemPrompt = `
你是“见家长 AI Copilot”的场景策略引擎。你的目标不是做命运判断，也不是制造焦虑，而是：
1. 帮用户在家庭互动场景中稳住分寸；
2. 给出真实、可执行、不过度讨好的建议；
3. 明确哪些建议属于普适社交逻辑，哪些是场景偏好；
4. 避免封建命理、地域歧视、性别羞辱和绝对化承诺。

输出风格：
- 像总参谋，不像说教老师；
- 结论简洁、动作具体；
- 优先给现场可执行的步骤和话术框架；
- 允许用户保持边界，不鼓励牺牲自我去讨好。
`.trim();

export const coupleDimensions: { id: CoupleDimension; title: string; description: string }[] = [
  {
    id: "alignment",
    title: "口径统一",
    description: "你们对婚期、工作城市、房车和父母预期是否有一致表达。",
  },
  {
    id: "role-split",
    title: "角色分工",
    description: "开场、接敏感问题、补位、收尾是否有人主导。",
  },
  {
    id: "pressure-response",
    title: "高压反应",
    description: "被问现实问题或被比较时，谁会逞强、谁会回避。",
  },
  {
    id: "boundary-sense",
    title: "边界协同",
    description: "在长辈热情、亲戚打探和饭后帮忙时是否会一起守住边界。",
  },
];

export const socialPlaybookModules = [
  "短视频脚本",
  "图文笔记标题",
  "评论区高频回复",
  "私域首条欢迎语",
  "敏感问题答法卡片",
  "情侣协同话题卡",
];

export const starterContexts: VisitContext[] = [
  {
    role: "male",
    familyStyle: "north-ritual",
    familyBackground: "public-sector",
    stage: "first-visit",
    attendees: ["parents", "grandparents"],
    userConcern: "担心被问收入和婚期，怕自己说满。",
  },
  {
    role: "female",
    familyStyle: "jiangzhe-refined",
    familyBackground: "academic",
    stage: "serious-meeting",
    attendees: ["parents", "siblings"],
    userConcern: "怕第一次见面太拘谨，冷场时不知道怎么接。",
  },
  {
    role: "male",
    familyStyle: "south-pragmatic",
    familyBackground: "business",
    stage: "marriage-discussion",
    attendees: ["parents", "relatives"],
    userConcern: "这次可能会聊房子和彩礼，希望提前统一口径。",
  },
];

export const concernByStage: Record<VisitStage, string[]> = {
  "first-visit": ["第一印象", "礼物递送", "称呼与寒暄"],
  "serious-meeting": ["工作稳定性", "关系态度", "双方父母感受"],
  "marriage-discussion": ["婚期", "房车/预算", "双方家庭预期"],
  "holiday-visit": ["节日礼数", "熟悉后的分寸", "送礼与停留时长"],
  engagement: ["具体安排", "双方长辈次序", "现场协同"],
};

export const roleLabel: Record<RoleType, string> = {
  male: "男生",
  female: "女生",
  common: "通用",
};
