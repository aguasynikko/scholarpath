import ReactMarkdown from "react-markdown";
import type { Citation } from "@/types/api";

interface Props {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
}

export function ChatMessage({ role, content, citations }: Props) {
  const isUser = role === "user";

  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-0.5 ${
          isUser
            ? "bg-brand-red text-white"
            : "bg-brand-gold text-black"
        }`}
      >
        {isUser ? "You" : "SP"}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-brand-red text-white rounded-br-sm"
              : "bg-surface-light dark:bg-surface-dark-alt border border-surface-light-border dark:border-surface-dark-border text-ink-light-strong dark:text-ink-dark-strong rounded-bl-sm"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="space-y-1">
              <ReactMarkdown
                components={{
                  // Convert bare asterisk lines the LLM sometimes outputs
                  p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-outside pl-4 space-y-0.5 my-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-outside pl-4 space-y-0.5 my-1">{children}</ol>,
                  li: ({ children }) => <li className="leading-snug">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                  code: ({ children }) => (
                    <code className="bg-black/10 dark:bg-white/10 rounded px-1 py-0.5 text-xs font-mono">{children}</code>
                  ),
                }}
              >
                {/* Normalize LLM output: "* text" → "- text" for react-markdown */}
                {content.replace(/^\* /gm, "- ")}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Citations */}
        {citations && citations.length > 0 && (
          <details className="text-xs w-full">
            <summary className="cursor-pointer text-brand-gold-dark dark:text-brand-gold hover:underline font-medium select-none">
              ▶ {citations.length} source{citations.length > 1 ? "s" : ""}
            </summary>
            <ul className="mt-2 space-y-1.5 pl-1">
              {citations.map((c, i) => (
                <li
                  key={i}
                  className="border-l-2 border-brand-gold pl-2 text-ink-light-muted dark:text-ink-dark-muted"
                >
                  <span className="font-mono font-semibold text-brand-red dark:text-brand-red-light">
                    p.{c.page}
                  </span>{" "}
                  {c.snippet}…
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}
