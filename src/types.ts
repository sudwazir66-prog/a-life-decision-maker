export type Verdict = 'A' | 'B' | 'either' | 'more_info_needed';
export type RecommendationChoice = 'A' | 'B' | 'either' | 'need_more_info';
export type RiskSeverity = 'low' | 'medium' | 'high';
export type RiskAppliesTo = 'A' | 'B' | 'both';

export interface Option {
  id: 'A' | 'B';
  label: string;
}

export interface ComparisonItem {
  criterion: string;
  option_a: string;
  option_b: string;
}

export interface ProsConsList {
  pros: string[];
  cons: string[];
}

export interface RiskItem {
  risk: string;
  applies_to: RiskAppliesTo;
  severity: RiskSeverity;
}

export interface ShortLongTerm {
  A: string;
  B: string;
}

export interface Outcomes {
  short_term: ShortLongTerm;
  long_term: ShortLongTerm;
}

export interface AdvisorPerspective {
  verdict: Verdict;
  reasoning: string;
}

export interface Perspectives {
  financial_advisor: AdvisorPerspective;
  teacher: AdvisorPerspective;
  psychologist: AdvisorPerspective;
  entrepreneur: AdvisorPerspective;
  future_you: AdvisorPerspective;
}

export interface FinalRecommendation {
  choice: RecommendationChoice;
  confidence_score: number;
  one_line_reason: string;
  caveat: string;
}

export interface DecisionEvaluation {
  decision_summary: string;
  options: Option[];
  comparison: ComparisonItem[];
  pros_cons: {
    A: ProsConsList;
    B: ProsConsList;
  };
  risks: RiskItem[];
  outcomes: Outcomes;
  perspectives: Perspectives;
  final_recommendation: FinalRecommendation;
  is_safety_crisis?: boolean;
  safety_message?: string;
}

export interface UserContext {
  prompt: string;
  optionA_override?: string;
  optionB_override?: string;
  financial_runway?: string;
  risk_tolerance?: number;
  time_horizon?: string;
  primary_priority?: string;
}

export interface SavedSimulation {
  id: string;
  title: string;
  timestamp: number;
  userContext: UserContext;
  result: DecisionEvaluation;
}
