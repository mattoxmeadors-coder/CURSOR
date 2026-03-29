export type CopilotMode = "prepare" | "align" | "plan";

export type VisitRole = "boyfriend" | "girlfriend" | "partner";

export type FamilyStyle =
  | "northern_ritual"
  | "northeast_warm"
  | "jiangzhe_refined"
  | "lingnan_practical"
  | "custom_heavy"
  | "chongqing_relaxed"
  | "balanced_central"
  | "metro_simple";

export type ParentBackground =
  | "system"
  | "business"
  | "salaried"
  | "agriculture"
  | "professional";

export type VisitType =
  | "first_visit"
  | "formal_meet"
  | "marriage_review"
  | "holiday_visit"
  | "engagement_prep";

export type Attendee =
  | "parents_only"
  | "grandparents"
  | "adult_siblings"
  | "children"
  | "relatives"
  | "neighbors";

export type Concern =
  | "gift"
  | "smalltalk"
  | "income"
  | "house_car"
  | "wedding_timeline"
  | "drinking"
  | "kitchen_help"
  | "cold_silence"
  | "title_address"
  | "children_red_envelope";

export type BehaviorStyle =
  | "steady"
  | "overperform"
  | "freeze"
  | "hard_push"
  | "people_please";

export type UnresolvedTopic =
  | "wedding_timeline"
  | "housing_plan"
  | "career_city"
  | "holiday_schedule"
  | "child_plan"
  | "family_boundary";

export interface ScenarioInput {
  role: VisitRole;
  familyStyle: FamilyStyle;
  parentBackground: ParentBackground;
  visitType: VisitType;
  attendees: Attendee[];
  concerns: Concern[];
  daysUntilVisit: number;
  selfStyle: BehaviorStyle;
  giftBudget?: number;
  notes?: string;
}

export interface AlignInput extends ScenarioInput {
  partnerStyle: BehaviorStyle;
  unresolvedTopics: UnresolvedTopic[];
}

export interface CopilotRequest {
  mode: CopilotMode;
  input: ScenarioInput | AlignInput;
}

export type Severity = "high" | "medium" | "low";

export interface RiskItem {
  title: string;
  severity: Severity;
  why: string;
  whatToDo: string;
  avoid: string;
}

export interface ActionStep {
  title: string;
  detail: string;
}

export interface BattleSection {
  title: string;
  summary: string;
  steps: ActionStep[];
}

export interface CoordinationSection {
  title: string;
  actions: string[];
}

export interface ContentPack {
  socialHooks: string[];
  crmTriggers: string[];
}

export interface CopilotOutput {
  mode: CopilotMode;
  headline: string;
  summary: string;
  readinessType: string;
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  topSignals: string[];
  risks: RiskItem[];
  battlePlan: BattleSection[];
  coordination: CoordinationSection[];
  simulationPrompts: string[];
  contentPack: ContentPack;
}
