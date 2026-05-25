import { useState } from "react";
import { ChatPage } from "@/pages/Chat";
import { Onboarding } from "@/pages/Onboarding";
import { Auth } from "@/pages/Auth";
import { useAuth, type Session } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import type { StudentProfile } from "@/types/api";

function onboardingKey(userId: string) {
  return `scholarpath_onboarding_complete_${userId}`;
}

export default function App() {
  const { session: initialSession, login, register, logout } = useAuth();
  const [session, setSession] = useState<Session | null>(initialSession);

  const [onboardingDone, setOnboardingDone] = useState<boolean>(() =>
    session ? !!localStorage.getItem(onboardingKey(session.userId)) : false
  );

  const { updateProfile } = useProfile();

  const handleAuthenticated = (s: Session) => {
    setSession(s);
    setOnboardingDone(!!localStorage.getItem(onboardingKey(s.userId)));
  };

  const handleOnboardingComplete = (profile: StudentProfile) => {
    updateProfile(profile);
    if (session) {
      localStorage.setItem(onboardingKey(session.userId), "1");
    }
    setOnboardingDone(true);
  };

  // 1. Not logged in → Auth
  if (!session) {
    return (
      <div className="flex h-full w-full p-4 items-center justify-center">
        <div className="w-full max-w-xl h-full max-h-[700px]">
          <Auth login={login} register={register} onAuthenticated={handleAuthenticated} />
        </div>
      </div>
    );
  }

  // 2. Logged in, onboarding pending → Onboarding
  if (!onboardingDone) {
    return (
      <div className="flex h-full w-full p-4 items-center justify-center">
        <div className="w-full max-w-xl h-full max-h-[700px]">
          <Onboarding onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    setSession(null);
    setOnboardingDone(false);
  };

  // 3. Ready → Chat
  return <ChatPage onLogout={handleLogout} userName={session.name} />;
}
