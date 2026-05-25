import { useState } from "react";
import { apiLogin, apiRegister } from "@/api/client";
const TOKEN_KEY = "scholarpath_token";
const SESSION_KEY = "scholarpath_session";
function loadSession() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    }
    catch {
        return null;
    }
}
export function useAuth() {
    const [session, setSession] = useState(loadSession);
    const register = async (name, studentId, email, password) => {
        try {
            const { token, user } = await apiRegister(name, studentId, email, password);
            localStorage.setItem(TOKEN_KEY, token);
            const s = { userId: user.id, studentId: user.studentId, name: user.name };
            localStorage.setItem(SESSION_KEY, JSON.stringify(s));
            setSession(s);
            return {};
        }
        catch (err) {
            const msg = err?.response?.data?.error ?? "Registration failed. Please try again.";
            return { error: msg };
        }
    };
    const login = async (identifier, password) => {
        try {
            const { token, user } = await apiLogin(identifier, password);
            localStorage.setItem(TOKEN_KEY, token);
            const s = { userId: user.id, studentId: user.studentId, name: user.name };
            localStorage.setItem(SESSION_KEY, JSON.stringify(s));
            setSession(s);
            return {};
        }
        catch (err) {
            const msg = err?.response?.data?.error ?? "Invalid credentials.";
            return { error: msg };
        }
    };
    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(SESSION_KEY);
        setSession(null);
    };
    return { session, register, login, logout };
}
