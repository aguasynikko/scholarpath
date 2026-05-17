import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { StudentProfile } from "@/types/api";

// ─── Constants ────────────────────────────────────────────────────────────────

type Step = 0 | 1 | 2 | 3; // 0=welcome, 1=academic, 2=financial+status, 3=mapua

const TOTAL_FORM_STEPS = 3;

// ─── Shared styles (mirrors ProfileForm exactly) ──────────────────────────────

const inputCls =
  "mt-1 w-full rounded border border-surface-light-border dark:border-surface-dark-border bg-surface-light dark:bg-surface-dark text-ink-light-strong dark:text-ink-dark-strong placeholder:text-ink-light-faint dark:placeholder:text-ink-dark-faint px-3 py-2 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition";

const labelCls = "text-sm font-medium text-ink-light-muted dark:text-ink-dark-muted";

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 bg-surface-light dark:bg-surface-dark-alt rounded-lg border border-surface-light-border dark:border-surface-dark-border p-4">
      <h3 className="text-xs font-bold uppercase tracking-wide text-brand-gold-dark dark:text-brand-gold border-b border-brand-gold/40 pb-1">
        {title}
      </h3>
      {children}
    </section>
  );
}

function YesNo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null | undefined;
  onChange: (v: boolean | null) => void;
}) {
  return (
    <div className="text-sm">
      <p className="text-ink-light-strong dark:text-ink-dark-strong mb-1.5">{label}</p>
      <div className="flex gap-1.5">
        {(
          [
            { l: "Yes", v: true as boolean | null },
            { l: "No", v: false as boolean | null },
            { l: "—", v: null },
          ] as const
        ).map(({ l, v }) => {
          const active = value === v;
          return (
            <button
              key={l}
              type="button"
              onClick={() => onChange(v)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                active
                  ? "bg-brand-gold text-black border-brand-gold shadow-sm"
                  : "bg-surface-light dark:bg-surface-dark text-ink-light-muted dark:text-ink-dark-muted border-surface-light-border dark:border-surface-dark-border hover:border-brand-gold hover:text-brand-gold-dark dark:hover:text-brand-gold"
              }`}
            >
              {l}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProgressBar({ step }: { step: Step }) {
  if (step === 0) return null;
  const pct = Math.round((step / TOTAL_FORM_STEPS) * 100);
  return (
    <div className="w-full h-1 bg-surface-light-border dark:bg-surface-dark-border rounded-full overflow-hidden">
      <div
        className="h-full bg-brand-red rounded-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function PageHeader({ step, stepLabel }: { step: Step; stepLabel?: string }) {
  return (
    <header className="bg-surface-light dark:bg-surface-dark-alt border-b-2 border-brand-gold px-4 py-3 shrink-0 space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-brand-red dark:text-brand-red-light flex items-center gap-2 text-lg">
          <span className="inline-block w-2 h-5 bg-brand-gold rounded-sm" />
          ScholarPath
        </h1>
        <ThemeToggle />
      </div>
      {step > 0 && (
        <>
          <ProgressBar step={step} />
          <p className="text-xs text-ink-light-muted dark:text-ink-dark-muted">{stepLabel}</p>
        </>
      )}
    </header>
  );
}

function NavBar({
  onBack,
  onNext,
  nextLabel = "Continue",
  showBack = true,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  showBack?: boolean;
}) {
  return (
    <div className="shrink-0 border-t border-surface-light-border dark:border-surface-dark-border bg-surface-light dark:bg-surface-dark-alt px-4 py-3 flex items-center gap-3">
      {showBack && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded text-sm font-semibold text-ink-light-muted dark:text-ink-dark-muted border border-surface-light-border dark:border-surface-dark-border hover:border-brand-red/40 hover:text-ink-light-strong dark:hover:text-ink-dark-strong transition"
        >
          Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        className="ml-auto px-5 py-2 rounded bg-brand-red text-white text-sm font-bold hover:bg-brand-red-dark transition shadow-sm"
      >
        {nextLabel}
      </button>
    </div>
  );
}

// ─── Main Onboarding ──────────────────────────────────────────────────────────

interface Props {
  onComplete: (profile: StudentProfile) => void;
}

export function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState<Step>(0);
  const [profile, setProfile] = useState<StudentProfile>({});

  const update = <K extends keyof StudentProfile>(key: K, val: StudentProfile[K]) =>
    setProfile((p) => ({ ...p, [key]: val }));

  const next = () => setStep((s) => Math.min(s + 1, 3) as Step);
  const back = () => setStep((s) => Math.max(s - 1, 0) as Step);
  const finish = () => onComplete(profile);

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col h-full bg-surface-light-alt dark:bg-surface-dark rounded-lg overflow-hidden border border-surface-light-border dark:border-surface-dark-border">
      {children}
    </div>
  );

  const ScrollArea = ({ children }: { children: React.ReactNode }) => (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-lg mx-auto w-full px-4 py-6 flex flex-col gap-4">
        {children}
      </div>
    </div>
  );

  // ══ Step 0: Welcome ════════════════════════════════════════════════════════
  if (step === 0) {
    return (
      <Shell>
        <PageHeader step={0} />

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-6 text-center">
          {/* Crest icon */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-2 border-brand-gold bg-brand-gold/10 flex items-center justify-center">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-brand-gold-dark dark:text-brand-gold"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-red flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-ink-light-strong dark:text-ink-dark-strong">
              Welcome to ScholarPath
            </h2>
            <p className="text-sm text-ink-light-muted dark:text-ink-dark-muted max-w-sm mx-auto leading-relaxed">
              Your AI-powered scholarship navigator for Mapúa University. Ask eligibility questions in plain language — get answers grounded in the official handbook with page citations.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "📖 Handbook-grounded answers",
              "🔖 Page citations included",
              "🎯 Personalized to your profile",
            ].map((f) => (
              <span
                key={f}
                className="text-xs px-3 py-1.5 rounded-full bg-surface-light dark:bg-surface-dark-alt border border-surface-light-border dark:border-surface-dark-border text-ink-light-muted dark:text-ink-dark-muted"
              >
                {f}
              </span>
            ))}
          </div>

          {/* Privacy notice */}
          <div className="w-full max-w-sm flex items-start gap-3 rounded-lg border border-brand-gold/40 bg-brand-gold/10 px-4 py-3 text-sm text-ink-light-strong dark:text-ink-dark-strong text-left">
            <svg
              className="mt-0.5 shrink-0 text-brand-gold-dark dark:text-brand-gold"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>
              We'll ask a few quick questions about your academic and financial background so ScholarPath can give you more relevant answers.{" "}
              <strong className="text-ink-light-strong dark:text-ink-dark-strong">All data stays on your device.</strong>
            </p>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="shrink-0 border-t border-surface-light-border dark:border-surface-dark-border bg-surface-light dark:bg-surface-dark-alt px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={finish}
            className="text-sm text-ink-light-muted dark:text-ink-dark-muted hover:text-ink-light-strong dark:hover:text-ink-dark-strong transition underline underline-offset-2"
          >
            Skip setup
          </button>
          <button
            type="button"
            onClick={next}
            className="px-5 py-2 rounded bg-brand-red text-white text-sm font-bold hover:bg-brand-red-dark transition shadow-sm"
          >
            Get started →
          </button>
        </div>
      </Shell>
    );
  }

  // ══ Step 1: Academic ═══════════════════════════════════════════════════════
  if (step === 1) {
    return (
      <Shell>
        <PageHeader step={1} stepLabel="Step 1 of 3 — Academic Info" />
        <ScrollArea>
          <div>
            <h2 className="text-base font-bold text-ink-light-strong dark:text-ink-dark-strong">
              Academic Information
            </h2>
            <p className="text-sm text-ink-light-muted dark:text-ink-dark-muted mt-1">
              Used to match GWA requirements and year-level eligibility.
            </p>
          </div>

          <SectionCard title="Academic Standing">
            <label className="block">
              <span className={labelCls}>
                GWA{" "}
                <span className="font-normal opacity-70">(1.00 = highest, 5.00 = lowest)</span>
              </span>
              <input
                type="number"
                step="0.01"
                min="1"
                max="5"
                placeholder="e.g. 1.75"
                value={profile.gwa ?? ""}
                onChange={(e) => update("gwa", e.target.value ? Number(e.target.value) : null)}
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className={labelCls}>Year Level</span>
              <select
                value={profile.year_level ?? ""}
                onChange={(e) => update("year_level", e.target.value || null)}
                className={inputCls}
              >
                <option value="">— Select —</option>
                <option>Grade 11</option>
                <option>Grade 12</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
                <option>5th Year</option>
              </select>
            </label>
            <label className="block">
              <span className={labelCls}>Program / Course</span>
              <input
                type="text"
                placeholder="e.g. BS Computer Engineering"
                value={profile.program ?? ""}
                onChange={(e) => update("program", e.target.value || null)}
                className={inputCls}
              />
            </label>
          </SectionCard>

          <SectionCard title="High School (for incoming freshmen)">
            <label className="block">
              <span className={labelCls}>Honors received at graduation</span>
              <select
                value={profile.hs_honors ?? ""}
                onChange={(e) => update("hs_honors", e.target.value || null)}
                className={inputCls}
              >
                <option value="">— Select —</option>
                <option value="highest">With Highest Honors</option>
                <option value="high">With High Honors</option>
                <option value="with_honor">With Honors</option>
                <option value="none">None / Not applicable</option>
              </select>
            </label>
          </SectionCard>
        </ScrollArea>
        <NavBar showBack={false} onNext={next} />
      </Shell>
    );
  }

  // ══ Step 2: Financial + Status ════════════════════════════════════════════
  if (step === 2) {
    return (
      <Shell>
        <PageHeader step={2} stepLabel="Step 2 of 3 — Financial & Status" />
        <ScrollArea>
          <div>
            <h2 className="text-base font-bold text-ink-light-strong dark:text-ink-dark-strong">
              Financial & Background
            </h2>
            <p className="text-sm text-ink-light-muted dark:text-ink-dark-muted mt-1">
              Many need-based scholarships have income thresholds. Your answers stay on this device only.
            </p>
          </div>

          <SectionCard title="Financial">
            <label className="block">
              <span className={labelCls}>Annual Family Income (PHP)</span>
              <input
                type="number"
                placeholder="e.g. 480000"
                value={profile.family_income ?? ""}
                onChange={(e) =>
                  update("family_income", e.target.value ? Number(e.target.value) : null)
                }
                className={inputCls}
              />
              <p className="text-xs text-ink-light-muted dark:text-ink-dark-muted mt-1">
                Gross household income for the year. Leave blank to skip.
              </p>
            </label>
          </SectionCard>

          <SectionCard title="Background">
            <YesNo
              label="Filipino citizen"
              value={profile.is_filipino}
              onChange={(v) => update("is_filipino", v)}
            />
            <YesNo
              label="Person with disability (PWD)"
              value={profile.is_pwd}
              onChange={(v) => update("is_pwd", v)}
            />
            <YesNo
              label="Member of an indigenous community"
              value={profile.is_indigenous}
              onChange={(v) => update("is_indigenous", v)}
            />
            <YesNo
              label="Athlete (NCAA-eligible or represents Mapúa)"
              value={profile.is_athlete}
              onChange={(v) => update("is_athlete", v)}
            />
          </SectionCard>
        </ScrollArea>
        <NavBar onBack={back} onNext={next} />
      </Shell>
    );
  }

  // ══ Step 3: Mapúa Relationships ═══════════════════════════════════════════
  return (
    <Shell>
      <PageHeader step={3} stepLabel="Step 3 of 3 — Mapúa Connections" />
      <ScrollArea>
        <div>
          <h2 className="text-base font-bold text-ink-light-strong dark:text-ink-dark-strong">
            Mapúa Relationships
          </h2>
          <p className="text-sm text-ink-light-muted dark:text-ink-dark-muted mt-1">
            Several institutional scholarships are reserved for students connected to the Mapúa community.
          </p>
        </div>

        <SectionCard title="Family & Institutional Ties">
          <YesNo
            label="Direct family member is a Mapúa alumnus"
            value={profile.is_alumni_relative}
            onChange={(v) => update("is_alumni_relative", v)}
          />
          <YesNo
            label="Child of a Mapúa faculty member"
            value={profile.is_faculty_child}
            onChange={(v) => update("is_faculty_child", v)}
          />
          <YesNo
            label="Mapúa employee or family of one"
            value={profile.is_employee_relative}
            onChange={(v) => update("is_employee_relative", v)}
          />
          <YesNo
            label="Sibling currently enrolled at Mapúa"
            value={profile.has_sibling_enrolled}
            onChange={(v) => update("has_sibling_enrolled", v)}
          />
        </SectionCard>

        <div className="flex items-start gap-3 rounded-lg border border-brand-gold/40 bg-brand-gold/10 px-4 py-3 text-sm text-ink-light-strong dark:text-ink-dark-strong">
          <svg
            className="mt-0.5 shrink-0 text-brand-gold-dark dark:text-brand-gold"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p>
            Your profile will be shared across all your chats and can be updated anytime from the sidebar.
          </p>
        </div>
      </ScrollArea>
      <NavBar onBack={back} onNext={finish} nextLabel="Start chatting →" />
    </Shell>
  );
}
