import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatHistory } from "@/components/ChatHistory";
import { ProfileForm } from "@/components/ProfileForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useChat } from "@/hooks/useChat";
import { useChatSessions } from "@/hooks/useChatSessions";
import { useProfile } from "@/hooks/useProfile";
const SUGGESTIONS = [
    "Am I eligible for the Academic Scholarship with a 1.50 GWA?",
    "What scholarships are available for Civil Engineering students?",
    "Which scholarships require family income below PHP 500,000?",
    "What are the requirements for the DOST-SEI scholarship?",
];
function ChatArea({ profile, initialTurns, onTurnsUpdate, sidebarOpen, onOpenSidebar }) {
    const [input, setInput] = useState("");
    const bottomRef = useRef(null);
    const { turns, send, isLoading } = useChat(profile, {
        initialTurns,
        onUpdate: (next) => {
            const firstUserMsg = next.find((t) => t.role === "user")?.content ?? "";
            const title = firstUserMsg
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
    const onSubmit = (e) => {
        e.preventDefault();
        const msg = input.trim();
        if (!msg || isLoading)
            return;
        send(msg);
        setInput("");
    };
    return (_jsxs("main", { className: "flex-1 flex flex-col bg-surface-light-alt dark:bg-surface-dark rounded-lg overflow-hidden border border-surface-light-border dark:border-surface-dark-border min-w-0", children: [_jsxs("header", { className: "bg-surface-light dark:bg-surface-dark-alt border-b-2 border-brand-gold px-4 py-3 flex items-center justify-between shrink-0 gap-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [!sidebarOpen && (_jsx("button", { onClick: onOpenSidebar, title: "Open sidebar", className: "p-1 rounded hover:bg-black/8 dark:hover:bg-white/10 transition text-ink-light-muted dark:text-ink-dark-muted hover:text-ink-light-strong dark:hover:text-ink-dark-strong", children: _jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }), _jsx("line", { x1: "3", y1: "12", x2: "21", y2: "12" }), _jsx("line", { x1: "3", y1: "18", x2: "21", y2: "18" })] }) })), _jsxs("div", { children: [_jsxs("h1", { className: "font-bold text-brand-red dark:text-brand-red-light flex items-center gap-2 text-lg", children: [_jsx("span", { className: "inline-block w-2 h-5 bg-brand-gold rounded-sm" }), "ScholarPath"] }), _jsx("p", { className: "text-xs text-ink-light-muted dark:text-ink-dark-muted", children: "AI Scholarship Navigator \u00B7 Map\u00FAa University" })] })] }), _jsx(ThemeToggle, {})] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [turns.length === 0 && (_jsxs("div", { className: "text-center text-ink-light-muted dark:text-ink-dark-muted py-8", children: [_jsx("p", { className: "mb-4", children: "Ask me about Map\u00FAa scholarships. Try:" }), _jsx("div", { className: "flex flex-wrap gap-2 justify-center", children: SUGGESTIONS.map((s) => (_jsx("button", { onClick: () => send(s), className: "text-sm bg-surface-light dark:bg-surface-dark-alt border border-brand-red/40 text-brand-red dark:text-brand-red-light rounded-full px-3 py-1 hover:bg-brand-red hover:text-white dark:hover:bg-brand-red dark:hover:text-white transition", children: s }, s))) })] })), turns.map((t, i) => (_jsx(ChatMessage, { role: t.role, content: t.content, citations: t.citations }, i))), isLoading && (_jsx("div", { className: "text-sm text-brand-gold-dark dark:text-brand-gold italic", children: "ScholarPath is thinking\u2026" })), _jsx("div", { ref: bottomRef })] }), followUps.length > 0 && (_jsx("div", { className: "px-4 pb-2 flex flex-wrap gap-2 shrink-0", children: followUps.map((q) => (_jsx("button", { onClick: () => { if (!isLoading)
                        send(q); }, className: "text-sm bg-surface-light dark:bg-surface-dark-alt border border-brand-red/40 text-brand-red dark:text-brand-red-light rounded-full px-3 py-1 hover:bg-brand-red hover:text-white dark:hover:bg-brand-red dark:hover:text-white transition", children: q }, q))) })), _jsxs("form", { onSubmit: onSubmit, className: "border-t border-surface-light-border dark:border-surface-dark-border bg-surface-light dark:bg-surface-dark-alt p-3 flex gap-2 shrink-0", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), placeholder: "Ask about a scholarship\u2026", className: "flex-1 rounded border border-surface-light-border dark:border-surface-dark-border bg-surface-light dark:bg-surface-dark text-ink-light-strong dark:text-ink-dark-strong placeholder:text-ink-light-faint dark:placeholder:text-ink-dark-faint px-3 py-2 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red", disabled: isLoading }), _jsx("button", { type: "submit", disabled: isLoading || !input.trim(), className: "bg-brand-red text-white px-4 py-2 rounded font-semibold hover:bg-brand-red-dark disabled:opacity-50 transition", children: "Send" })] })] }));
}
export function ChatPage({ onLogout, userName }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [view, setView] = useState("chat");
    const { profile, updateProfile } = useProfile();
    const { sessions, activeId, activeSession, createSession, updateSession, deleteSession, switchSession, } = useChatSessions();
    // Ensure there's always at least one session on first load
    useEffect(() => {
        if (!activeId)
            createSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleTurnsUpdate = (turns, title) => {
        if (activeId)
            updateSession(activeId, { turns, title });
    };
    return (_jsxs("div", { className: "flex h-full w-full p-4 gap-4 overflow-hidden", children: [_jsx("aside", { className: `shrink-0 overflow-hidden transition-all duration-200 rounded-lg ${sidebarOpen ? "w-64" : "w-0"}`, children: _jsx("div", { className: "w-64 h-full", children: _jsx(ChatHistory, { sessions: sessions, activeId: activeId, onSelect: (id) => { switchSession(id); setView("chat"); }, onCreate: () => { createSession(); setView("chat"); }, onDelete: deleteSession, onToggle: () => setSidebarOpen(false), onOpenProfile: () => setView("profile"), onLogout: onLogout, userName: userName }) }) }), _jsx("div", { className: "flex-1 flex min-w-0", children: view === "profile" ? (_jsxs("main", { className: "flex-1 flex flex-col bg-surface-light-alt dark:bg-surface-dark rounded-lg overflow-hidden border border-surface-light-border dark:border-surface-dark-border min-w-0", children: [_jsxs("header", { className: "bg-surface-light dark:bg-surface-dark-alt border-b-2 border-brand-gold px-4 py-3 flex items-center gap-3 shrink-0", children: [!sidebarOpen && (_jsx("button", { onClick: () => setSidebarOpen(true), title: "Open sidebar", className: "p-1 rounded hover:bg-black/8 dark:hover:bg-white/10 transition text-ink-light-muted dark:text-ink-dark-muted hover:text-ink-light-strong dark:hover:text-ink-dark-strong", children: _jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }), _jsx("line", { x1: "3", y1: "12", x2: "21", y2: "12" }), _jsx("line", { x1: "3", y1: "18", x2: "21", y2: "18" })] }) })), _jsx("button", { onClick: () => setView("chat"), title: "Back to chat", className: "p-1 rounded hover:bg-black/8 dark:hover:bg-white/10 transition text-ink-light-muted dark:text-ink-dark-muted hover:text-ink-light-strong dark:hover:text-ink-dark-strong", children: _jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: "19", y1: "12", x2: "5", y2: "12" }), _jsx("polyline", { points: "12 19 5 12 12 5" })] }) }), _jsxs("div", { children: [_jsxs("h1", { className: "font-bold text-brand-red dark:text-brand-red-light flex items-center gap-2 text-lg", children: [_jsx("span", { className: "inline-block w-2 h-5 bg-brand-gold rounded-sm" }), "Your Profile"] }), _jsx("p", { className: "text-xs text-ink-light-muted dark:text-ink-dark-muted", children: "Shared across all your chats" })] })] }), _jsxs("div", { className: "mx-4 mt-4 flex items-start gap-3 rounded-lg border border-brand-gold/40 bg-brand-gold/10 px-4 py-3 text-sm text-ink-light-strong dark:text-ink-dark-strong shrink-0", children: [_jsxs("svg", { className: "mt-0.5 shrink-0 text-brand-gold-dark dark:text-brand-gold", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }), _jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })] }), _jsx("p", { children: "Your profile is shared across all chats and saved locally on this device. Once accounts are available, it will be tied to your student account automatically." })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-4", children: _jsx(ProfileForm, { profile: profile, onChange: updateProfile }) })] })) : activeSession ? (_jsx(ChatArea, { profile: profile, initialTurns: activeSession.turns, onTurnsUpdate: handleTurnsUpdate, sidebarOpen: sidebarOpen, onOpenSidebar: () => setSidebarOpen(true) }, activeSession.id)) : (_jsx("main", { className: "flex-1 flex items-center justify-center text-ink-light-muted dark:text-ink-dark-muted rounded-lg border border-surface-light-border dark:border-surface-dark-border", children: _jsx("p", { children: "Start a new chat to begin." }) })) })] }));
}
