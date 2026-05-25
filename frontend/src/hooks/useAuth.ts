import { useState } from "react";
import { apiLogin, apiRegister } from "@/api/client";
import { retryOnWakeup } from "@/lib/retryOnWakeup";

const TOKEN_KEY = "scholarpath_token";
const SESSION_KEY = "scholarpath_session";

export interface Session {
  userId: string;
  studentId: string;
  name: string;
}

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(loadSession);
  const [wakingUp, setWakingUp] = useState(false);

  const register = async (
    name: string,
    studentId: string,
    email: string,
    password: string
  ): Promise<{ error?: string }> => {
    try {
      const { token, user } = await retryOnWakeup(
        () => apiRegister(name, studentId, email, password),
        setWakingUp
      );
      localStorage.setItem(TOKEN_KEY, token);
      const s: Session = { userId: user.id, studentId: user.studentId, name: user.name };
      localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      setSession(s);
      return {};
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? "Registration failed. Please try again.";
      return { error: msg };
    }
  };

  const login = async (
    identifier: string,
    password: string
  ): Promise<{ error?: string }> => {
    try {
      const { token, user } = await retryOnWakeup(
        () => apiLogin(identifier, password),
        setWakingUp
      );
      localStorage.setItem(TOKEN_KEY, token);
      const s: Session = { userId: user.id, studentId: user.studentId, name: user.name };
      localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      setSession(s);
      return {};
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? "Invalid credentials.";
      return { error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  return { session, register, login, logout, wakingUp };
}
