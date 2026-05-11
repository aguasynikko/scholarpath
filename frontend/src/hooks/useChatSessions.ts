import { useState } from "react";
import type { ChatTurn } from "@/hooks/useChat";

export interface ChatSession {
  id: string;
  createdAt: string;
  title: string;
  turns: ChatTurn[];
}

const STORAGE_KEY = "scholarpath_sessions";

function loadSessions(): ChatSession[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions);
  const [activeId, setActiveId] = useState<string | null>(() => {
    const loaded = loadSessions();
    return loaded.length > 0 ? loaded[0].id : null;
  });

  const persist = (updated: ChatSession[]) => {
    setSessions(updated);
    saveSessions(updated);
  };

  const createSession = (): string => {
    const id = crypto.randomUUID();
    const session: ChatSession = {
      id,
      createdAt: new Date().toISOString(),
      title: "New Chat",
      turns: [],
    };
    const updated = [session, ...sessions];
    persist(updated);
    setActiveId(id);
    return id;
  };

  const updateSession = (
    id: string,
    patch: Partial<Pick<ChatSession, "title" | "turns">>,
  ) => {
    persist(sessions.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const deleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    persist(updated);
    if (activeId === id) {
      setActiveId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const activeSession = sessions.find((s) => s.id === activeId) ?? null;

  return {
    sessions,
    activeId,
    activeSession,
    createSession,
    updateSession,
    deleteSession,
    switchSession: setActiveId,
  };
}
