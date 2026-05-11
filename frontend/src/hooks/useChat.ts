import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { sendChat } from "@/api/client";
import type { ChatMessage, Citation, StudentProfile } from "@/types/api";

export interface ChatTurn extends ChatMessage {
  citations?: Citation[];
  followUpQuestions?: string[];
}

export function useChat(
  profile: StudentProfile,
  options: {
    initialTurns?: ChatTurn[];
    onUpdate?: (turns: ChatTurn[]) => void;
  } = {},
) {
  const { initialTurns = [] } = options;
  const [turns, setTurnsRaw] = useState<ChatTurn[]>(initialTurns);

  // Keep onUpdate stable via ref so mutation closures don't go stale
  const onUpdateRef = useRef(options.onUpdate);
  onUpdateRef.current = options.onUpdate;

  const setTurns = (updater: (prev: ChatTurn[]) => ChatTurn[]) => {
    setTurnsRaw((prev) => {
      const next = updater(prev);
      onUpdateRef.current?.(next);
      return next;
    });
  };

  const mutation = useMutation({
    mutationFn: (message: string) =>
      sendChat({
        message,
        profile,
        history: turns.map(({ role, content }) => ({ role, content })),
      }),
    onMutate: (message) => {
      setTurns((t) => [...t, { role: "user", content: message }]);
    },
    onSuccess: (data) => {
      setTurns((t) => [
        ...t,
        {
          role: "assistant",
          content: data.answer,
          citations: data.citations,
          followUpQuestions: data.follow_up_questions,
        },
      ]);
    },
    onError: (err: Error) => {
      setTurns((t) => [
        ...t,
        { role: "assistant", content: `Error: ${err.message}` },
      ]);
    },
  });

  return {
    turns,
    send: mutation.mutate,
    isLoading: mutation.isPending,
  };
}
