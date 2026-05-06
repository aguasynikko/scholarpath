import type { StudentProfile } from "@/types/api";

interface Props {
  profile: StudentProfile;
  onChange: (p: StudentProfile) => void;
}

const inputCls =
  "mt-1 w-full rounded border border-surface-light-border dark:border-surface-dark-border bg-surface-light dark:bg-surface-dark text-ink-light-strong dark:text-ink-dark-strong placeholder:text-ink-light-faint dark:placeholder:text-ink-dark-faint px-2 py-1 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red";

const labelCls = "text-ink-light-muted dark:text-ink-dark-muted font-medium";

export function ProfileForm({ profile, onChange }: Props) {
  const update = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) =>
    onChange({ ...profile, [key]: value });

  return (
    <div className="bg-surface-light dark:bg-surface-dark-alt rounded-lg p-4 border border-surface-light-border dark:border-surface-dark-border space-y-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <h2 className="font-bold text-brand-red dark:text-brand-red-light flex items-center gap-2 text-lg">
        <span className="inline-block w-2 h-4 bg-brand-gold rounded-sm" />
        Your Profile
      </h2>

      <Section title="Academic">
        <label className="block text-sm">
          <span className={labelCls}>GWA (1.00 = highest, 5.00 = lowest)</span>
          <input
            type="number"
            step="0.01"
            min="1"
            max="5"
            value={profile.gwa ?? ""}
            onChange={(e) => update("gwa", e.target.value ? Number(e.target.value) : null)}
            className={inputCls}
          />
        </label>
        <label className="block text-sm">
          <span className={labelCls}>Year Level</span>
          <select
            value={profile.year_level ?? ""}
            onChange={(e) => update("year_level", e.target.value || null)}
            className={inputCls}
          >
            <option value="">—</option>
            <option>Grade 11</option>
            <option>Grade 12</option>
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>4th Year</option>
            <option>5th Year</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className={labelCls}>Program</span>
          <input
            type="text"
            placeholder="e.g. BS Computer Engineering"
            value={profile.program ?? ""}
            onChange={(e) => update("program", e.target.value || null)}
            className={inputCls}
          />
        </label>
      </Section>

      <Section title="Financial">
        <label className="block text-sm">
          <span className={labelCls}>Annual Family Income (PHP)</span>
          <input
            type="number"
            value={profile.family_income ?? ""}
            onChange={(e) =>
              update("family_income", e.target.value ? Number(e.target.value) : null)
            }
            className={inputCls}
          />
        </label>
      </Section>

      <Section title="Background">
        <YesNo label="Filipino citizen" value={profile.is_filipino} onChange={(v) => update("is_filipino", v)} />
        <YesNo
          label="I am an athlete (NCAA-eligible or represent Mapúa)"
          value={profile.is_athlete}
          onChange={(v) => update("is_athlete", v)}
        />
        <YesNo
          label="I am a member of an indigenous community"
          value={profile.is_indigenous}
          onChange={(v) => update("is_indigenous", v)}
        />
        <YesNo
          label="I am a person with disability (PWD)"
          value={profile.is_pwd}
          onChange={(v) => update("is_pwd", v)}
        />
      </Section>

      <Section title="Mapúa Relationships">
        <YesNo
          label="I have a direct family member who is a Mapúa alumnus"
          value={profile.is_alumni_relative}
          onChange={(v) => update("is_alumni_relative", v)}
        />
        <YesNo
          label="I am a child of a Mapúa faculty member"
          value={profile.is_faculty_child}
          onChange={(v) => update("is_faculty_child", v)}
        />
        <YesNo
          label="I am a Mapúa employee or family of one"
          value={profile.is_employee_relative}
          onChange={(v) => update("is_employee_relative", v)}
        />
        <YesNo
          label="I have a sibling currently enrolled at Mapúa"
          value={profile.has_sibling_enrolled}
          onChange={(v) => update("has_sibling_enrolled", v)}
        />
      </Section>

      <Section title="High School (for freshmen)">
        <label className="block text-sm">
          <span className={labelCls}>Honors received</span>
          <select
            value={profile.hs_honors ?? ""}
            onChange={(e) => update("hs_honors", e.target.value || null)}
            className={inputCls}
          >
            <option value="">—</option>
            <option value="highest">With Highest Honors</option>
            <option value="high">With High Honors</option>
            <option value="with_honor">With Honors</option>
            <option value="none">None</option>
          </select>
        </label>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-bold uppercase tracking-wide text-brand-gold-dark dark:text-brand-gold border-b border-brand-gold/40 pb-1">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
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
      <p className="text-ink-light-strong dark:text-ink-dark-strong mb-1">{label}</p>
      <div className="flex gap-1">
        <Pill active={value === true} onClick={() => onChange(true)}>
          Yes
        </Pill>
        <Pill active={value === false} onClick={() => onChange(false)}>
          No
        </Pill>
        <Pill active={value == null} onClick={() => onChange(null)}>
          —
        </Pill>
      </div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
        active
          ? "bg-brand-gold text-black border-brand-gold shadow-sm"
          : "bg-surface-light dark:bg-surface-dark text-ink-light-muted dark:text-ink-dark-muted border-surface-light-border dark:border-surface-dark-border hover:border-brand-gold hover:text-brand-gold-dark dark:hover:text-brand-gold"
      }`}
    >
      {children}
    </button>
  );
}
