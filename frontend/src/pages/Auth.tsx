import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Session } from "@/hooks/useAuth";

// ─── Shared styles ─────────────────────────────────────────────────────────────

const inputCls =
  "mt-1 w-full rounded border border-surface-light-border dark:border-surface-dark-border bg-surface-light dark:bg-surface-dark text-ink-light-strong dark:text-ink-dark-strong placeholder:text-ink-light-faint dark:placeholder:text-ink-dark-faint px-3 py-2 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition";

const labelCls = "text-sm font-medium text-ink-light-muted dark:text-ink-dark-muted";

type Tab = "login" | "register";

export interface AuthProps {
  login: (identifier: string, password: string) => Promise<{ error?: string }>;
  register: (name: string, studentId: string, email: string, password: string) => Promise<{ error?: string }>;
  onAuthenticated: (session: Session) => void;
  wakingUp?: boolean;
}

// ─── Login Form ────────────────────────────────────────────────────────────────

function LoginForm({
  login,
  onSuccess,
}: {
  login: AuthProps["login"];
  onSuccess: AuthProps["onAuthenticated"];
}) {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!studentId.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    const result = await login(studentId.trim(), password);
    if (result.error) {
      setError(result.error);
    } else {
      const raw = localStorage.getItem("scholarpath_session");
      if (raw) onSuccess(JSON.parse(raw));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="block">
        <span className={labelCls}>Student ID or Email</span>
        <input
          type="text"
          placeholder="e.g. 2021-12345 or you@email.com"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className={inputCls}
          autoComplete="username"
        />
      </label>
      <label className="block">
        <span className={labelCls}>Password</span>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
          autoComplete="current-password"
        />
      </label>

      {error && (
        <p className="text-sm text-brand-red dark:text-brand-red-light font-medium">{error}</p>
      )}

      <button
        type="submit"
        className="w-full py-2.5 rounded bg-brand-red text-white text-sm font-bold hover:bg-brand-red-dark transition shadow-sm"
      >
        Sign In
      </button>
    </form>
  );
}

// ─── Register Form ─────────────────────────────────────────────────────────────

function RegisterForm({
  register,
  onSuccess,
}: {
  register: AuthProps["register"];
  onSuccess: AuthProps["onAuthenticated"];
}) {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const result = await register(name.trim(), studentId.trim(), email.trim(), password);
    if (result.error) {
      setError(result.error);
    } else {
      const raw = localStorage.getItem("scholarpath_session");
      if (raw) onSuccess(JSON.parse(raw));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="block">
        <span className={labelCls}>Full Name</span>
        <input
          type="text"
          placeholder="e.g. Juan dela Cruz"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
          autoComplete="name"
        />
      </label>
      <label className="block">
        <span className={labelCls}>
          Student ID{" "}
          <span className="font-normal opacity-60">(optional — if already enrolled at Mapúa)</span>
        </span>
        <input
          type="text"
          placeholder="e.g. 2021-12345"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className={inputCls}
          autoComplete="username"
        />
      </label>
      <label className="block">
        <span className={labelCls}>Email Address</span>
        <input
          type="email"
          placeholder="e.g. jdelacruz@mymail.mapua.edu.ph"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
          autoComplete="email"
        />
      </label>
      <label className="block">
        <span className={labelCls}>Password</span>
        <input
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
          autoComplete="new-password"
        />
      </label>
      <label className="block">
        <span className={labelCls}>Confirm Password</span>
        <input
          type="password"
          placeholder="Re-enter your password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={inputCls}
          autoComplete="new-password"
        />
      </label>

      {error && (
        <p className="text-sm text-brand-red dark:text-brand-red-light font-medium">{error}</p>
      )}

      <button
        type="submit"
        className="w-full py-2.5 rounded bg-brand-red text-white text-sm font-bold hover:bg-brand-red-dark transition shadow-sm"
      >
        Create Account
      </button>
    </form>
  );
}

// ─── Main Auth Page ────────────────────────────────────────────────────────────

export function Auth({ login, register, onAuthenticated, wakingUp }: AuthProps) {
  const [tab, setTab] = useState<Tab>("login");

  return (
    <div className="flex flex-col h-full bg-surface-light-alt dark:bg-surface-dark rounded-lg overflow-hidden border border-surface-light-border dark:border-surface-dark-border">
      {/* Header */}
      <header className="bg-surface-light dark:bg-surface-dark-alt border-b-2 border-brand-gold px-4 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-brand-red dark:text-brand-red-light flex items-center gap-2 text-lg">
            <span className="inline-block w-2 h-5 bg-brand-gold rounded-sm" />
            ScholarPath
          </h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-sm mx-auto w-full px-4 py-8 flex flex-col gap-6">
          {/* Icon + heading */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-brand-gold bg-brand-gold/10 flex items-center justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-brand-gold-dark dark:text-brand-gold"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink-light-strong dark:text-ink-dark-strong">
                {tab === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-sm text-ink-light-muted dark:text-ink-dark-muted mt-1">
                {tab === "login"
                  ? "Sign in to access your scholarship chat history."
                  : "Register with your Mapúa student account."}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex rounded-lg border border-surface-light-border dark:border-surface-dark-border overflow-hidden">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-semibold transition ${
                  tab === t
                    ? "bg-brand-red text-white"
                    : "bg-surface-light dark:bg-surface-dark text-ink-light-muted dark:text-ink-dark-muted hover:text-ink-light-strong dark:hover:text-ink-dark-strong"
                }`}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Form */}
          {tab === "login" ? (
            <LoginForm login={login} onSuccess={onAuthenticated} />
          ) : (
            <RegisterForm register={register} onSuccess={onAuthenticated} />
          )}
        </div>
      </div>

      {/* Waking up banner */}
      {wakingUp && (
        <div className="shrink-0 bg-brand-gold/10 border-t border-brand-gold/30 px-4 py-2 flex items-center gap-2">
          <svg className="animate-spin w-4 h-4 text-brand-gold-dark dark:text-brand-gold shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
          </svg>
          <p className="text-xs text-brand-gold-dark dark:text-brand-gold font-medium">
            Server is waking up, please wait a moment…
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="shrink-0 border-t border-surface-light-border dark:border-surface-dark-border bg-surface-light dark:bg-surface-dark-alt px-4 py-3">
        <p className="text-xs text-center text-ink-light-muted dark:text-ink-dark-muted">
          For Mapúa University students and incoming students. Your data stays on this device during the pilot.
        </p>
      </div>
    </div>
  );
}
