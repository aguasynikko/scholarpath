import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { ChatPage } from "@/pages/Chat";
import { Onboarding } from "@/pages/Onboarding";
import { Auth } from "@/pages/Auth";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
function onboardingKey(userId) {
    return `scholarpath_onboarding_complete_${userId}`;
}
export default function App() {
    const { session: initialSession, login, register, logout } = useAuth();
    const [session, setSession] = useState(initialSession);
    const [onboardingDone, setOnboardingDone] = useState(() => session ? !!localStorage.getItem(onboardingKey(session.userId)) : false);
    const { updateProfile } = useProfile();
    const handleAuthenticated = (s) => {
        setSession(s);
        setOnboardingDone(!!localStorage.getItem(onboardingKey(s.userId)));
    };
    const handleOnboardingComplete = (profile) => {
        updateProfile(profile);
        if (session) {
            localStorage.setItem(onboardingKey(session.userId), "1");
        }
        setOnboardingDone(true);
    };
    // 1. Not logged in → Auth
    if (!session) {
        return (_jsx("div", { className: "flex h-full w-full p-4 items-center justify-center", children: _jsx("div", { className: "w-full max-w-xl h-full max-h-[700px]", children: _jsx(Auth, { login: login, register: register, onAuthenticated: handleAuthenticated }) }) }));
    }
    // 2. Logged in, onboarding pending → Onboarding
    if (!onboardingDone) {
        return (_jsx("div", { className: "flex h-full w-full p-4 items-center justify-center", children: _jsx("div", { className: "w-full max-w-xl h-full max-h-[700px]", children: _jsx(Onboarding, { onComplete: handleOnboardingComplete }) }) }));
    }
    const handleLogout = () => {
        logout();
        setSession(null);
        setOnboardingDone(false);
    };
    // 3. Ready → Chat
    return _jsx(ChatPage, { onLogout: handleLogout, userName: session.name });
}
