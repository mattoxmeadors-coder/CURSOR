import { COUPLE_ALIGNMENT_PROMPTS, FAMILY_STYLE_OPTIONS, KNOWLEDGE_CARDS, SOLO_QUESTIONS } from "@/lib/content";
import type { CoupleAlignmentInput, SoloAssessmentInput } from "@/lib/types";

export const defaultSoloInput: SoloAssessmentInput = {
  userName: "你",
  gender: "male",
  familyStyleId: FAMILY_STYLE_OPTIONS[0].id,
  parentBackground: "system",
  meetingStage: "first-visit",
  attendees: ["parents-only", "grandparents"],
  daysUntilVisit: 7,
  anxietyLevel: 8,
  rawContext:
    "下周第一次去女朋友家。她妈妈比较细致，家里大概率会有爷爷奶奶。我最怕被问收入和婚期，也担心饭桌上太拘谨。",
  questionResponses: SOLO_QUESTIONS.map((question) => ({
    questionId: question.id,
    selectedOptionId: question.options[0]?.id ?? "",
  })),
  requestedOutputs: ["battle-plan", "gift-plan", "conversation-scripts", "content-pack"],
};

export const defaultCoupleInput: CoupleAlignmentInput = {
  partnerAName: "我",
  partnerBName: "TA",
  meetingStage: "serious-meeting",
  familyStyleId: FAMILY_STYLE_OPTIONS[0].id,
  parentBackground: "business",
  pressureTopics: ["timeline", "housing", "city", "children"],
  tensionPoints: [
    {
      promptId: COUPLE_ALIGNMENT_PROMPTS[0].id,
      aChoiceId: COUPLE_ALIGNMENT_PROMPTS[0].choices[1].id,
      bChoiceId: COUPLE_ALIGNMENT_PROMPTS[0].choices[0].id,
      note: "我怕被问得太具体，TA希望给长辈更多确定感。",
    },
    {
      promptId: COUPLE_ALIGNMENT_PROMPTS[1].id,
      aChoiceId: COUPLE_ALIGNMENT_PROMPTS[1].choices[0].id,
      bChoiceId: COUPLE_ALIGNMENT_PROMPTS[1].choices[2].id,
      note: "我想主动多说，TA担心我抢节奏。",
    },
  ],
  sharedContext:
    "双方已经稳定交往一年，家长知道彼此存在。这次是第一次正式吃饭，婚期还没定，买房也没有明确计划。",
};

export const defaultCards = KNOWLEDGE_CARDS.slice(0, 3);
