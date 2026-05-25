import { useState } from "react";
const STORAGE_KEY = "scholarpath_sessions";
function loadSessions() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }
    catch {
        return [];
    }
}
function saveSessions(sessions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}
export function useChatSessions() {
    const [sessions, setSessions] = useState(loadSessions);
    const [activeId, setActiveId] = useState(() => {
        const loaded = loadSessions();
        return loaded.length > 0 ? loaded[0].id : null;
    });
    const persist = (updated) => {
        setSessions(updated);
        saveSessions(updated);
    };
    const createSession = () => {
        const id = crypto.randomUUID();
        const session = {
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
    const updateSession = (id, patch) => {
        persist(sessions.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    };
    const deleteSession = (id) => {
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
