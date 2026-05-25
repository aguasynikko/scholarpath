import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
// ─── Shared styles ─────────────────────────────────────────────────────────────
const inputCls = "mt-1 w-full rounded border border-surface-light-border dark:border-surface-dark-border bg-surface-light dark:bg-surface-dark text-ink-light-strong dark:text-ink-dark-strong placeholder:text-ink-light-faint dark:placeholder:text-ink-dark-faint px-3 py-2 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition";
const labelCls = "text-sm font-medium text-ink-light-muted dark:text-ink-dark-muted";
// ─── Login Form ────────────────────────────────────────────────────────────────
function LoginForm({ login, onSuccess, }) {
    const [studentId, setStudentId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!studentId.trim() || !password) {
            setError("Please fill in all fields.");
            return;
        }
        const result = await login(studentId.trim(), password);
        if (result.error) {
            setError(result.error);
        }
        else {
            const raw = localStorage.getItem("scholarpath_session");
            if (raw)
                onSuccess(JSON.parse(raw));
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-4", children: [_jsxs("label", { className: "block", children: [_jsx("span", { className: labelCls, children: "Student ID or Email" }), _jsx("input", { type: "text", placeholder: "e.g. 2021-12345 or you@email.com", value: studentId, onChange: (e) => setStudentId(e.target.value), className: inputCls, autoComplete: "username" })] }), _jsxs("label", { className: "block", children: [_jsx("span", { className: labelCls, children: "Password" }), _jsx("input", { type: "password", placeholder: "Enter your password", value: password, onChange: (e) => setPassword(e.target.value), className: inputCls, autoComplete: "current-password" })] }), error && (_jsx("p", { className: "text-sm text-brand-red dark:text-brand-red-light font-medium", children: error })), _jsx("button", { type: "submit", className: "w-full py-2.5 rounded bg-brand-red text-white text-sm font-bold hover:bg-brand-red-dark transition shadow-sm", children: "Sign In" })] }));
}
// ─── Register Form ─────────────────────────────────────────────────────────────
function RegisterForm({ register, onSuccess, }) {
    const [name, setName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!name.trim() || !email.trim() || !password) {
            setError("Please fill in all required fields.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        const result = await register(name.trim(), studentId.trim(), email.trim(), password);
        if (result.error) {
            setError(result.error);
        }
        else {
            const raw = localStorage.getItem("scholarpath_session");
            if (raw)
                onSuccess(JSON.parse(raw));
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-4", children: [_jsxs("label", { className: "block", children: [_jsx("span", { className: labelCls, children: "Full Name" }), _jsx("input", { type: "text", placeholder: "e.g. Juan dela Cruz", value: name, onChange: (e) => setName(e.target.value), className: inputCls, autoComplete: "name" })] }), _jsxs("label", { className: "block", children: [_jsxs("span", { className: labelCls, children: ["Student ID", " ", _jsx("span", { className: "font-normal opacity-60", children: "(optional \u2014 if already enrolled at Map\u00FAa)" })] }), _jsx("input", { type: "text", placeholder: "e.g. 2021-12345", value: studentId, onChange: (e) => setStudentId(e.target.value), className: inputCls, autoComplete: "username" })] }), _jsxs("label", { className: "block", children: [_jsx("span", { className: labelCls, children: "Email Address" }), _jsx("input", { type: "email", placeholder: "e.g. jdelacruz@mymail.mapua.edu.ph", value: email, onChange: (e) => setEmail(e.target.value), className: inputCls, autoComplete: "email" })] }), _jsxs("label", { className: "block", children: [_jsx("span", { className: labelCls, children: "Password" }), _jsx("input", { type: "password", placeholder: "At least 6 characters", value: password, onChange: (e) => setPassword(e.target.value), className: inputCls, autoComplete: "new-password" })] }), _jsxs("label", { className: "block", children: [_jsx("span", { className: labelCls, children: "Confirm Password" }), _jsx("input", { type: "password", placeholder: "Re-enter your password", value: confirm, onChange: (e) => setConfirm(e.target.value), className: inputCls, autoComplete: "new-password" })] }), error && (_jsx("p", { className: "text-sm text-brand-red dark:text-brand-red-light font-medium", children: error })), _jsx("button", { type: "submit", className: "w-full py-2.5 rounded bg-brand-red text-white text-sm font-bold hover:bg-brand-red-dark transition shadow-sm", children: "Create Account" })] }));
}
// ─── Main Auth Page ────────────────────────────────────────────────────────────
export function Auth({ login, register, onAuthenticated }) {
    const [tab, setTab] = useState("login");
    return (_jsxs("div", { className: "flex flex-col h-full bg-surface-light-alt dark:bg-surface-dark rounded-lg overflow-hidden border border-surface-light-border dark:border-surface-dark-border", children: [_jsx("header", { className: "bg-surface-light dark:bg-surface-dark-alt border-b-2 border-brand-gold px-4 py-3 shrink-0", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h1", { className: "font-bold text-brand-red dark:text-brand-red-light flex items-center gap-2 text-lg", children: [_jsx("span", { className: "inline-block w-2 h-5 bg-brand-gold rounded-sm" }), "ScholarPath"] }), _jsx(ThemeToggle, {})] }) }), _jsx("div", { className: "flex-1 overflow-y-auto", children: _jsxs("div", { className: "max-w-sm mx-auto w-full px-4 py-8 flex flex-col gap-6", children: [_jsxs("div", { className: "flex flex-col items-center gap-3 text-center", children: [_jsx("div", { className: "w-16 h-16 rounded-full border-2 border-brand-gold bg-brand-gold/10 flex items-center justify-center", children: _jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", className: "text-brand-gold-dark dark:text-brand-gold", children: [_jsx("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }), _jsx("circle", { cx: "12", cy: "7", r: "4" })] }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-ink-light-strong dark:text-ink-dark-strong", children: tab === "login" ? "Welcome back" : "Create your account" }), _jsx("p", { className: "text-sm text-ink-light-muted dark:text-ink-dark-muted mt-1", children: tab === "login"
                                                ? "Sign in to access your scholarship chat history."
                                                : "Register with your Mapúa student account." })] })] }), _jsx("div", { className: "flex rounded-lg border border-surface-light-border dark:border-surface-dark-border overflow-hidden", children: ["login", "register"].map((t) => (_jsx("button", { type: "button", onClick: () => setTab(t), className: `flex-1 py-2 text-sm font-semibold transition ${tab === t
                                    ? "bg-brand-red text-white"
                                    : "bg-surface-light dark:bg-surface-dark text-ink-light-muted dark:text-ink-dark-muted hover:text-ink-light-strong dark:hover:text-ink-dark-strong"}`, children: t === "login" ? "Sign In" : "Register" }, t))) }), tab === "login" ? (_jsx(LoginForm, { login: login, onSuccess: onAuthenticated })) : (_jsx(RegisterForm, { register: register, onSuccess: onAuthenticated }))] }) }), _jsx("div", { className: "shrink-0 border-t border-surface-light-border dark:border-surface-dark-border bg-surface-light dark:bg-surface-dark-alt px-4 py-3", children: _jsx("p", { className: "text-xs text-center text-ink-light-muted dark:text-ink-dark-muted", children: "For Map\u00FAa University students and incoming students. Your data stays on this device during the pilot." }) })] }));
}
