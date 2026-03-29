export type CopilotMode = "prepare" | "align" | "battlePlan";

export type Persona = "male" | "female";

export type FamilyStyleId =
  | "north-ritual"
  | "northeast-warm"
  | "jiangzhe-refined"
  | "south-pragmatic"
  | "chaoshan-custom"
  | "sichuan-relaxed"
  | "central-balanced"
  | "city-modern";

export type ParentBackgroundId =
  | "system"
  | "business"
  | "salaried"
  | "agriculture"
  | "professional";

export type RelationStageId =
  | "first-visit"
  | "serious-meeting"
  | "marriage-discussion"
  | "holiday-visit"
  | "engagement";

export type ChoiceState = "yes" | "partial" | "no";
export type RiskLevel = "low" | "medium" | "high";

export interface FamilyStyleOption {
  id: FamilyStyleId;
  label: string;
  description: string;
  focus: string[];
  giftTone: string;
  scriptTone: string;
}

export interface SelectOption<T extends string> {
  id: T;
  label: string;
  description?: string;
}

export interface KnowledgeCard {
  title: string;
  bullets: string[];
}

export interface OperationBlueprintItem {
  id: string;
  title: string;
  description: string;
}

export interface SocialAutomationItem {
  title: string;
  description: string;
}

export interface CopilotInput {
  mode: CopilotMode;
  persona: Persona;
  familyStyle: FamilyStyleId;
  parentBackground: ParentBackgroundId;
  relationStage: RelationStageId;
  scheduledTime: string;
  budget: string;
  attendees: string[];
  primaryStressors: string[];
  alignmentReady: ChoiceState;
  parentPressure: ChoiceState;
  notes: string;
}

export interface RiskSummary {
  title: string;
  reason: string;
  severity: RiskLevel;
}

export interface BattlePlanPhase {
  phase: string;
  actions: string[];
}

export interface GiftPlan {
  title: string;
  summary: string;
  items: string[];
}

export interface ContentPack {
  shortVideoHooks: string[];
  socialPosts: string[];
  privateDomainOpen: string;
}

export interface CopilotResponse {
  heroTitle: string;
  heroSummary: string;
  riskLevel: RiskLevel;
  riskScore: number;
  personaLabel: string;
  topRisks: RiskSummary[];
  battlePlan: BattlePlanPhase[];
  alignmentSummary: string;
  alignmentActions: string[];
  giftPlan: GiftPlan;
  contentPack: ContentPack;
  knowledgeRecommendations: string[];
  simulationPrompts: string[];
}
