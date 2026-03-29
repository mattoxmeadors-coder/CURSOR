import { familyStyles, singleKnowledgeCards } from "@/lib/content";
import type { CopilotInput } from "@/lib/types";

export const defaultCopilotInput: CopilotInput = {
  mode: "prepare",
  persona: "male",
  familyStyle: familyStyles[0].id,
  parentBackground: "system",
  relationStage: "first-visit",
  scheduledTime: "下周六晚饭",
  budget: "300-500",
  attendees: ["只有对方父母", "有祖辈"],
  primaryStressors: ["怕被问收入/房车", "怕婚期话题", "怕饭桌场景失手"],
  alignmentReady: "no",
  parentPressure: "yes",
  notes:
    "下周第一次去女朋友家。她妈妈比较细致，家里大概率会有爷爷奶奶。我最怕被问收入和婚期，也担心饭桌上太拘谨。",
};

export const defaultCards = singleKnowledgeCards.slice(0, 3);
export const defaultInput = defaultCopilotInput;
