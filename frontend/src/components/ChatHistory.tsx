import { useEffect, useRef, useState } from "react";
import type { ChatSession } from "@/hooks/useChatSessions";

interface Props {
  sessions: ChatSession[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onToggle: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  userName: string;
}

export function ChatHistory({ sessions, activeId, onSelect, onCreate, onDelete, onToggle, onOpenProfile, onLogout, userName }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredSessions = searchQuery.trim()
    ? sessions.filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : sessions;

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);
  return (
    <div className="flex flex-col h-full bg-surface-light-alt dark:bg-surface-dark text-ink-light-strong dark:text-ink-dark-strong border border-surface-light-border dark:border-surface-dark-border rounded-lg overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3 shrink-0">
        <button
          onClick={onToggle}
          title="Close sidebar"
          className="p-1 rounded hover:bg-black/8 dark:hover:bg-white/10 transition text-ink-light-muted dark:text-ink-dark-muted hover:text-ink-light-strong dark:hover:text-ink-dark-strong"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <button
          className="p-1 rounded hover:bg-black/8 dark:hover:bg-white/10 transition text-ink-light-muted dark:text-ink-dark-muted hover:text-ink-light-strong dark:hover:text-ink-dark-strong"
          title="Search chats"
          onClick={() => {
            setSearchOpen((o) => {
              if (!o) setTimeout(() => searchRef.current?.focus(), 50);
              else setSearchQuery("");
              return !o;
            });
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>

      {/* Search input */}
      {searchOpen && (
        <div className="px-3 pb-2 shrink-0">
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats…"
            className="w-full rounded border border-surface-light-border dark:border-surface-dark-border bg-surface-light dark:bg-surface-dark text-sm text-ink-light-strong dark:text-ink-dark-strong placeholder:text-ink-light-faint dark:placeholder:text-ink-dark-faint px-3 py-1.5 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red"
          />
        </div>
      )}

      {/* New chat */}
      <div className="px-3 pb-3 shrink-0">
        <button
          onClick={onCreate}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-ink-light-muted dark:text-ink-dark-muted hover:bg-black/8 dark:hover:bg-white/10 hover:text-ink-light-strong dark:hover:text-ink-dark-strong transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          New chat
        </button>
      </div>

      {/* Chats list */}
      <div className="flex-1 overflow-y-auto px-2">
        {filteredSessions.length > 0 && (
          <p className="px-2 py-1 text-xs font-semibold text-ink-light-faint dark:text-ink-dark-faint uppercase tracking-wider mb-1">
            Chats
          </p>
        )}
        {sessions.length === 0 && (
          <p className="text-xs text-center text-ink-light-faint dark:text-ink-dark-faint py-8">
            No chats yet
          </p>
        )}
        {sessions.length > 0 && filteredSessions.length === 0 && (
          <p className="text-xs text-center text-ink-light-faint dark:text-ink-dark-faint py-8">
            No chats match "{searchQuery}"
          </p>
        )}
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            onClick={() => onSelect(session.id)}
            className={`group relative flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition mb-0.5 ${
              session.id === activeId
                ? "bg-brand-gold text-black"
                : "text-ink-light-muted dark:text-ink-dark-muted hover:bg-black/6 dark:hover:bg-white/8 hover:text-ink-light-strong dark:hover:text-ink-dark-strong"
            }`}
          >
            <span className="flex-1 text-sm truncate">{session.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(session.id);
              }}
              title="Delete"
              className="opacity-0 group-hover:opacity-100 shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-black/20 text-black/60 hover:text-black transition text-base leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Footer — user profile button */}
      <div className="px-3 py-3 border-t border-surface-light-border dark:border-surface-dark-border shrink-0 relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-lg text-sm text-ink-light-muted dark:text-ink-dark-muted hover:bg-black/6 dark:hover:bg-white/8 hover:text-ink-light-strong dark:hover:text-ink-dark-strong transition"
        >
          {/* Avatar circle */}
          <span className="shrink-0 w-7 h-7 rounded-full bg-brand-gold/20 border border-brand-gold/50 flex items-center justify-center text-brand-gold-dark dark:text-brand-gold">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <span className="flex-1 text-left truncate text-ink-light-strong dark:text-ink-dark-strong font-medium">
            {userName}
          </span>
          {/* Chevron */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`shrink-0 transition-transform ${menuOpen ? "rotate-180" : ""}`}
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-1 rounded-lg border border-surface-light-border dark:border-surface-dark-border bg-surface-light dark:bg-surface-dark-alt shadow-lg overflow-hidden">
            <button
              onClick={() => { setMenuOpen(false); onOpenProfile(); }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-ink-light-strong dark:text-ink-dark-strong hover:bg-black/6 dark:hover:bg-white/8 transition"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Edit Profile
            </button>
            <div className="border-t border-surface-light-border dark:border-surface-dark-border" />
            <button
              onClick={() => { setMenuOpen(false); onLogout(); }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-brand-red dark:text-brand-red-light hover:bg-brand-red/8 transition"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
