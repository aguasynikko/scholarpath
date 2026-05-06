import axios from "axios";
import type { ChatRequest, ChatResponse } from "@/types/api";

// In dev with local backend: leave VITE_API_URL unset; Vite proxies /api to localhost:8000.
// With Colab backend: set VITE_API_URL=https://<id>.trycloudflare.com in frontend/.env
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

const api = axios.create({ baseURL });

export async function sendChat(payload: ChatRequest): Promise<ChatResponse> {
  const { data } = await api.post<ChatResponse>("/chat", payload);
  return data;
}

export async function getHealth(): Promise<{ status: string; indexed_chunks: number }> {
  const { data } = await api.get("/health");
  return data;
}
