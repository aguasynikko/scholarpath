import axios from "axios";
import type { ChatRequest, ChatResponse } from "@/types/api";

const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

export const api = axios.create({ baseURL });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("scholarpath_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export async function sendChat(payload: ChatRequest): Promise<ChatResponse> {
  const { data } = await api.post<ChatResponse>("/chat", payload);
  return data;
}

export async function getHealth(): Promise<{ status: string; indexed_chunks: number }> {
  const { data } = await api.get("/health");
  return data;
}

export interface AuthUser {
  id: string;
  name: string;
  studentId: string;
}

export async function apiRegister(
  name: string, studentId: string, email: string, password: string
): Promise<{ token: string; user: AuthUser }> {
  const { data } = await api.post("/auth/register", { name, studentId, email, password });
  return data;
}

export async function apiLogin(
  identifier: string, password: string
): Promise<{ token: string; user: AuthUser }> {
  const { data } = await api.post("/auth/login", { identifier, password });
  return data;
}
