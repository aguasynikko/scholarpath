import Groq from "groq-sdk";
import { config } from "../config.js";
import type { ChatMessage, ChatResponse, StudentProfile } from "../types.js";
import { search, toCitations } from "./retriever.js";

const SYSTEM_PROMPT = `You are ScholarPath, an AI scholarship counselor for Mapúa University.

CRITICAL: Mapúa uses a GWA scale where 1.00 is the HIGHEST grade and 5.00 is the LOWEST (failing). A GWA of 1.50 is excellent; a GWA of 3.00 is the minimum passing grade. Never describe a numerically low GWA as a "low grade."

RULES:
1. Answer ONLY using the provided handbook excerpts. If the excerpts don't cover the question, say so — do NOT use outside knowledge about scholarships.
2. For general questions (e.g. "What is FAMIT?", "What scholarships exist?", "What are the requirements for X?"): answer directly and clearly from the excerpts. No eligibility walkthrough needed.
3. For personal eligibility questions (profile will always be provided when these reach you):
   a. Begin with: "Based on your profile (GWA: X, Year: Y, Program: Z, Family income: PHP W, Filipino: yes/no, ...), here's what I found:" — use actual values; write "not provided" for missing fields.
   b. Walk through each relevant scholarship: criterion · student's profile value · PASS / FAIL / NEED MORE INFO. Use a bullet list.
   c. End with a "Summary" of what they likely qualify for, what they don't, and what extra info would help.
4. Always cite page numbers like [p.7].
5. Use plain, student-friendly language. No legalese.`;

function yn(b: boolean | null | undefined): string {
  if (b === true) return "yes";
  if (b === false) return "no";
  return "not provided";
}

function formatProfile(profile: StudentProfile | null | undefined): string {
  if (!profile) return "No profile provided.";
  const parts: string[] = [];
  if (profile.gwa != null) parts.push(`GWA: ${profile.gwa}`);
  if (profile.year_level) parts.push(`Year level: ${profile.year_level}`);
  if (profile.program) parts.push(`Program: ${profile.program}`);
  if (profile.family_income != null)
    parts.push(`Annual family income: PHP ${profile.family_income.toLocaleString()}`);
  if (profile.is_filipino != null) parts.push(`Filipino citizen: ${yn(profile.is_filipino)}`);
  if (profile.is_athlete != null) parts.push(`Athlete (NCAA-eligible or representing Mapúa): ${yn(profile.is_athlete)}`);
  if (profile.is_alumni_relative != null)
    parts.push(`Direct family member of a Mapúa alumnus: ${yn(profile.is_alumni_relative)}`);
  if (profile.is_faculty_child != null)
    parts.push(`Child of a Mapúa faculty member: ${yn(profile.is_faculty_child)}`);
  if (profile.is_employee_relative != null)
    parts.push(`Mapúa employee or family of one: ${yn(profile.is_employee_relative)}`);
  if (profile.has_sibling_enrolled != null)
    parts.push(`Has a sibling currently enrolled at Mapúa: ${yn(profile.has_sibling_enrolled)}`);
  if (profile.is_indigenous != null)
    parts.push(`Member of an indigenous community: ${yn(profile.is_indigenous)}`);
  if (profile.is_pwd != null) parts.push(`Person with disability (PWD): ${yn(profile.is_pwd)}`);
  if (profile.hs_honors) parts.push(`High school honors: ${profile.hs_honors}`);
  return parts.length ? parts.join("; ") : "No profile provided.";
}

function profileIsEmpty(profile: StudentProfile | null | undefined): boolean {
  if (!profile) return true;
  const meaningful = [
    profile.gwa,
    profile.year_level,
    profile.program,
    profile.family_income,
    profile.is_filipino,
    profile.is_athlete,
    profile.is_alumni_relative,
    profile.is_faculty_child,
    profile.is_employee_relative,
    profile.has_sibling_enrolled,
    profile.is_indigenous,
    profile.is_pwd,
    profile.hs_honors,
  ];
  return meaningful.every((v) => v == null || v === "");
}

let groqClient: Groq | null = null;
function getGroq(): Groq {
  if (!groqClient) groqClient = new Groq({ apiKey: config.groqApiKey });
  return groqClient;
}

const PERSONAL_RE =
  /\b(am i|do i|can i|will i|should i|for me\b|my (gwa|income|program|year|profile|eligib)|i qualify|i eligible|i apply|qualify for me|based on my)\b/i;

function isPersonalQuestion(message: string): boolean {
  return PERSONAL_RE.test(message);
}

export async function answer(
  message: string,
  profile: StudentProfile | null | undefined,
  history: ChatMessage[],
): Promise<ChatResponse> {
  // Gate: personal question + empty profile → short-circuit, no LLM call needed
  if (isPersonalQuestion(message) && profileIsEmpty(profile)) {
    return {
      answer:
        "To assess your eligibility, I need your profile first — please fill out the **Profile form on the left** (GWA, year level, program, etc.), then ask again.",
      citations: [],
    };
  }

  const hits = search(message, 5);
  const context = hits.map((h) => `[p.${h.page}] ${h.text}`).join("\n\n");
  const profileStr = formatProfile(profile);
  const empty = profileIsEmpty(profile);

  const userContent = `PROFILE_EMPTY: ${empty}\nStudent profile: ${profileStr}\n\nHandbook excerpts:\n${context || "(no relevant excerpts found)"}\n\nQuestion: ${message}`;

  const completion = await getGroq().chat.completions.create({
    model: config.groqModel,
    temperature: 0.2,
    max_tokens: 1024,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: userContent },
    ],
  });

  return {
    answer: completion.choices[0]?.message?.content ?? "",
    citations: toCitations(hits),
  };
}
