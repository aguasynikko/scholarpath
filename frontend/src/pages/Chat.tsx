import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatHistory } from "@/components/ChatHistory";
import { ProfileForm } from "@/components/ProfileForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useChat, type ChatTurn } from "@/hooks/useChat";
import { useChatSessions } from "@/hooks/useChatSessions";
import { useProfile } from "@/hooks/useProfile";
import type { StudentProfile } from "@/types/api";

const SUGGESTIONS = [
  "Am I eligible for the Academic Scholarship with a 1.50 GWA?",
  "What scholarships are available for Civil Engineering students?",
  "Which scholarships require family income below PHP 500,000?",
  "What are the requirements for the DOST-SEI scholarship?",
];

// ─── ChatArea ─────────────────────────────────────────────────────────────────
// key={sessionId} on this component ensures state resets when session changes.

interface ChatAreaProps {
  profile: StudentProfile;
  initialTurns: ChatTurn[];
  onTurnsUpdate: (turns: ChatTurn[], title: string) => void;
  sidebarOpen: boolean;
  onOpenSidebar: () => void;
}

function ChatArea({ profile, initialTurns, onTurnsUpdate, sidebarOpen, onOpenSidebar }: ChatAreaProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { turns, send, isLoading } = useChat(profile, {
    initialTurns,
    onUpdate: (next) => {
      const firstUserMsg = next.find((t) => t.role === "user")?.content ?? "";
      const title =
        firstUserMsg
          ? firstUserMsg.slice(0, 45) + (firstUserMsg.length > 45 ? "…" : "")
          : "New Chat";
      onTurnsUpdate(next, title);
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns]);

  const lastAssistantTurn = [...turns].reverse().find((t) => t.role === "assistant");
  const followUps = !isLoading ? (lastAssistantTurn?.followUpQuestions ?? []) : [];

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = input.trim();
    if (!msg || isLoading) return;
    send(msg);
    setInput("");
  };

  return (
    <main className="flex-1 flex flex-col bg-surface-light-alt dark:bg-surface-dark rounded-lg overflow-hidden border border-surface-light-border dark:border-surface-dark-border min-w-0">
      <header className="bg-surface-light dark:bg-surface-dark-alt border-b-2 border-brand-gold px-4 py-3 flex items-center justify-between shrink-0 gap-3">
        <div className="flex items-center gap-3">
          {!sidebarOpen && (
            <button
              onClick={onOpenSidebar}
              title="Open sidebar"
              className="p-1 rounded hover:bg-black/8 dark:hover:bg-white/10 transition text-ink-light-muted dark:text-ink-dark-muted hover:text-ink-light-strong dark:hover:text-ink-dark-strong"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}
          <div>
            <h1 className="font-bold text-brand-red dark:text-brand-red-light flex items-center gap-2 text-lg">
              <span className="inline-block w-2 h-5 bg-brand-gold rounded-sm" />
              ScholarPath
            </h1>
            <p className="text-xs text-ink-light-muted dark:text-ink-dark-muted">
              AI Scholarship Navigator · Mapúa University
            </p>
          </div>
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

      {followUps.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0">
          {followUps.map((q) => (
            <button
              key={q}
              onClick={() => { if (!isLoading) send(q); }}
              className="text-sm bg-surface-light dark:bg-surface-dark-alt border border-brand-red/40 text-brand-red dark:text-brand-red-light rounded-full px-3 py-1 hover:bg-brand-red hover:text-white dark:hover:bg-brand-red dark:hover:text-white transition"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="border-t border-surface-light-border dark:border-surface-dark-border bg-surface-light dark:bg-surface-dark-alt p-3 flex gap-2 shrink-0"
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
  );
}

// ─── ChatPage ─────────────────────────────────────────────────────────────────

type View = "chat" | "profile";

export function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [view, setView] = useState<View>("chat");

  const { profile, updateProfile } = useProfile();

  const {
    sessions,
    activeId,
    activeSession,
    createSession,
    updateSession,
    deleteSession,
    switchSession,
  } = useChatSessions();

  // Ensure there's always at least one session on first load
  useEffect(() => {
    if (!activeId) createSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTurnsUpdate = (turns: ChatTurn[], title: string) => {
    if (activeId) updateSession(activeId, { turns, title });
  };

  return (
    <div className="flex h-full w-full p-4 gap-4 overflow-hidden">
      {/* Left sidebar — chat history */}
      <aside
        className={`shrink-0 overflow-hidden transition-all duration-200 rounded-lg ${
          sidebarOpen ? "w-64" : "w-0"
        }`}
      >
        <div className="w-64 h-full">
          <ChatHistory
            sessions={sessions}
            activeId={activeId}
            onSelect={(id) => { switchSession(id); setView("chat"); }}
            onCreate={() => { createSession(); setView("chat"); }}
            onDelete={deleteSession}
            onToggle={() => setSidebarOpen(false)}
            onOpenProfile={() => setView("profile")}
          />
        </div>
      </aside>

      {/* Main area — chat or profile */}
      <div className="flex-1 flex min-w-0">
        {view === "profile" ? (
          <main className="flex-1 flex flex-col bg-surface-light-alt dark:bg-surface-dark rounded-lg overflow-hidden border border-surface-light-border dark:border-surface-dark-border min-w-0">
            {/* Profile page header */}
            <header className="bg-surface-light dark:bg-surface-dark-alt border-b-2 border-brand-gold px-4 py-3 flex items-center gap-3 shrink-0">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  title="Open sidebar"
                  className="p-1 rounded hover:bg-black/8 dark:hover:bg-white/10 transition text-ink-light-muted dark:text-ink-dark-muted hover:text-ink-light-strong dark:hover:text-ink-dark-strong"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setView("chat")}
                title="Back to chat"
                className="p-1 rounded hover:bg-black/8 dark:hover:bg-white/10 transition text-ink-light-muted dark:text-ink-dark-muted hover:text-ink-light-strong dark:hover:text-ink-dark-strong"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
              <div>
                <h1 className="font-bold text-brand-red dark:text-brand-red-light flex items-center gap-2 text-lg">
                  <span className="inline-block w-2 h-5 bg-brand-gold rounded-sm" />
                  Your Profile
                </h1>
                <p className="text-xs text-ink-light-muted dark:text-ink-dark-muted">
                  Shared across all your chats
                </p>
              </div>
            </header>

            {/* Info banner */}
            <div className="mx-4 mt-4 flex items-start gap-3 rounded-lg border border-brand-gold/40 bg-brand-gold/10 px-4 py-3 text-sm text-ink-light-strong dark:text-ink-dark-strong shrink-0">
              <svg className="mt-0.5 shrink-0 text-brand-gold-dark dark:text-brand-gold" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p>
                Your profile is shared across all chats and saved locally on this device.
                Once accounts are available, it will be tied to your student account automatically.
              </p>
            </div>

            {/* Profile form content */}
            <div className="flex-1 overflow-y-auto p-4">
              <ProfileForm
                profile={profile}
                onChange={updateProfile}
              />
            </div>
          </main>
        ) : activeSession ? (
          <ChatArea
            key={activeSession.id}
            profile={profile}
            initialTurns={activeSession.turns}
            onTurnsUpdate={handleTurnsUpdate}
            sidebarOpen={sidebarOpen}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
        ) : (
          <main className="flex-1 flex items-center justify-center text-ink-light-muted dark:text-ink-dark-muted rounded-lg border border-surface-light-border dark:border-surface-dark-border">
            <p>Start a new chat to begin.</p>
          </main>
        )}
      </div>
    </div>
  );
}
