import type { Citation } from "@/types/api";

interface Props {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
}

export function ChatMessage({ role, content, citations }: Props) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-3 ${
          isUser
            ? "bg-brand-red text-white border border-brand-red-dark"
            : "bg-surface-light dark:bg-surface-dark-alt border border-surface-light-border dark:border-surface-dark-border text-ink-light-strong dark:text-ink-dark-strong"
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
        {citations && citations.length > 0 && (
          <details className="mt-3 text-xs">
            <summary className="cursor-pointer text-brand-gold-dark dark:text-brand-gold hover:underline font-medium">
              {citations.length} source{citations.length > 1 ? "s" : ""}
            </summary>
            <ul className="mt-2 space-y-1">
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
