import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ProfileForm } from "@/components/ProfileForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useChat } from "@/hooks/useChat";
import type { StudentProfile } from "@/types/api";

const SUGGESTIONS = [
  "Am I eligible for the Academic Scholarship with a 1.50 GWA?",
  "What scholarships are available for Civil Engineering students?",
  "Which scholarships require family income below PHP 500,000?",
  "What are the requirements for the DOST-SEI scholarship?",
];

export function ChatPage() {
  const [profile, setProfile] = useState<StudentProfile>({});
  const [input, setInput] = useState("");
  const { turns, send, isLoading } = useChat(profile);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = input.trim();
    if (!msg || isLoading) return;
    send(msg);
    setInput("");
  };

  return (
    <div className="flex h-full max-w-6xl mx-auto p-4 gap-4">
      <aside className="w-80 shrink-0">
        <ProfileForm profile={profile} onChange={setProfile} />
      </aside>

      <main className="flex-1 flex flex-col bg-surface-light-alt dark:bg-surface-dark rounded-lg overflow-hidden border border-surface-light-border dark:border-surface-dark-border">
        <header className="bg-surface-light dark:bg-surface-dark-alt border-b-2 border-brand-gold px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-brand-red dark:text-brand-red-light flex items-center gap-2 text-lg">
              <span className="inline-block w-2 h-5 bg-brand-gold rounded-sm" />
              ScholarPath
            </h1>
            <p className="text-xs text-ink-light-muted dark:text-ink-dark-muted">
              AI Scholarship Navigator · Mapúa University
            </p>
          </div>
          <ThemeToggle />
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {turns.length === 0 && (
            <div className="text-center text-ink-light-muted dark:text-ink-dark-muted py-8">
              <p className="mb-4">Ask me about Mapúa scholarships. Try:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-sm bg-surface-light dark:bg-surface-dark-alt border border-brand-red/40 text-brand-red dark:text-brand-red-light rounded-full px-3 py-1 hover:bg-brand-red hover:text-white dark:hover:bg-brand-red dark:hover:text-white transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {turns.map((t, i) => (
            <ChatMessage key={i} role={t.role} content={t.content} citations={t.citations} />
          ))}
          {isLoading && (
            <div className="text-sm text-brand-gold-dark dark:text-brand-gold italic">
              ScholarPath is thinking…
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={onSubmit}
          className="border-t border-surface-light-border dark:border-surface-dark-border bg-surface-light dark:bg-surface-dark-alt p-3 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a scholarship…"
            className="flex-1 rounded border border-surface-light-border dark:border-surface-dark-border bg-surface-light dark:bg-surface-dark text-ink-light-strong dark:text-ink-dark-strong placeholder:text-ink-light-faint dark:placeholder:text-ink-dark-faint px-3 py-2 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-brand-red text-white px-4 py-2 rounded font-semibold hover:bg-brand-red-dark disabled:opacity-50 transition"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
