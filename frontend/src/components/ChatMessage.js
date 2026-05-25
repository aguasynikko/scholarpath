import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ReactMarkdown from "react-markdown";
export function ChatMessage({ role, content, citations }) {
    const isUser = role === "user";
    return (_jsxs("div", { className: `flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`, children: [_jsx("div", { className: `shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-0.5 ${isUser
                    ? "bg-brand-red text-white"
                    : "bg-brand-gold text-black"}`, children: isUser ? "You" : "SP" }), _jsxs("div", { className: `max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`, children: [_jsx("div", { className: `rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
                            ? "bg-brand-red text-white rounded-br-sm"
                            : "bg-surface-light dark:bg-surface-dark-alt border border-surface-light-border dark:border-surface-dark-border text-ink-light-strong dark:text-ink-dark-strong rounded-bl-sm"}`, children: isUser ? (_jsx("p", { className: "whitespace-pre-wrap", children: content })) : (_jsx("div", { className: "space-y-1", children: _jsx(ReactMarkdown, { components: {
                                    // Convert bare asterisk lines the LLM sometimes outputs
                                    p: ({ children }) => _jsx("p", { className: "mb-1 last:mb-0", children: children }),
                                    ul: ({ children }) => _jsx("ul", { className: "list-disc list-outside pl-4 space-y-0.5 my-1", children: children }),
                                    ol: ({ children }) => _jsx("ol", { className: "list-decimal list-outside pl-4 space-y-0.5 my-1", children: children }),
                                    li: ({ children }) => _jsx("li", { className: "leading-snug", children: children }),
                                    strong: ({ children }) => _jsx("strong", { className: "font-semibold", children: children }),
                                    code: ({ children }) => (_jsx("code", { className: "bg-black/10 dark:bg-white/10 rounded px-1 py-0.5 text-xs font-mono", children: children })),
                                }, children: content.replace(/^\* /gm, "- ") }) })) }), citations && citations.length > 0 && (_jsxs("details", { className: "text-xs w-full", children: [_jsxs("summary", { className: "cursor-pointer text-brand-gold-dark dark:text-brand-gold hover:underline font-medium select-none", children: ["\u25B6 ", citations.length, " source", citations.length > 1 ? "s" : ""] }), _jsx("ul", { className: "mt-2 space-y-1.5 pl-1", children: citations.map((c, i) => (_jsxs("li", { className: "border-l-2 border-brand-gold pl-2 text-ink-light-muted dark:text-ink-dark-muted", children: [_jsxs("span", { className: "font-mono font-semibold text-brand-red dark:text-brand-red-light", children: ["p.", c.page] }), " ", c.snippet, "\u2026"] }, i))) })] }))] })] }));
}
