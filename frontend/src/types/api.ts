export interface StudentProfile {
  gwa?: number | null;
  year_level?: string | null;
  program?: string | null;
  family_income?: number | null;
  is_filipino?: boolean | null;

  // Status / relationship questions
  is_athlete?: boolean | null;
  is_alumni_relative?: boolean | null;
  is_faculty_child?: boolean | null;
  is_employee_relative?: boolean | null;
  has_sibling_enrolled?: boolean | null;
  is_indigenous?: boolean | null;
  is_pwd?: boolean | null;

  // High school context (used by freshman scholarships)
  hs_honors?: string | null; // "highest" | "high" | "with_honor" | "none"

  extras?: Record<string, string>;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Citation {
  page: number;
  snippet: string;
  score: number;
}

export interface ChatRequest {
  message: string;
  profile?: StudentProfile | null;
  history: ChatMessage[];
}

export interface ChatResponse {
  answer: string;
  citations: Citation[];
}
