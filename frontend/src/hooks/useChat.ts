import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { sendChat } from "@/api/client";
import type { ChatMessage, Citation, StudentProfile } from "@/types/api";

export interface ChatTurn extends ChatMessage {
  citations?: Citation[];
}

export function useChat(profile: StudentProfile) {
  const [turns, setTurns] = useState<ChatTurn[]>([]);

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
        { role: "assistant", content: data.answer, citations: data.citations },
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
