import { z } from "zod";

export const StudentProfileSchema = z.object({
  gwa: z.number().nullable().optional(),
  year_level: z.string().nullable().optional(),
  program: z.string().nullable().optional(),
  family_income: z.number().nullable().optional(),
  is_filipino: z.boolean().nullable().optional(),

  is_athlete: z.boolean().nullable().optional(),
  is_alumni_relative: z.boolean().nullable().optional(),
  is_faculty_child: z.boolean().nullable().optional(),
  is_employee_relative: z.boolean().nullable().optional(),
  has_sibling_enrolled: z.boolean().nullable().optional(),
  is_indigenous: z.boolean().nullable().optional(),
  is_pwd: z.boolean().nullable().optional(),

  hs_honors: z.string().nullable().optional(),

  extras: z.record(z.string()).optional(),
});

export const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

export const ChatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  profile: StudentProfileSchema.nullable().optional(),
  history: z.array(ChatMessageSchema).default([]),
});

export type StudentProfile = z.infer<typeof StudentProfileSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export interface Chunk {
  id: string;
  page: number;
  text: string;
}

export interface Citation {
  page: number;
  snippet: string;
  score: number;
}

export interface ChatResponse {
  answer: string;
  citations: Citation[];
}
