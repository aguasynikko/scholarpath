import { useState, useEffect } from "react";
import { ChatPage } from "@/pages/Chat";
import { Onboarding } from "@/pages/Onboarding";
import { useProfile } from "@/hooks/useProfile";
import type { StudentProfile } from "@/types/api";

const ONBOARDING_KEY = "scholarpath_onboarding_complete";

export default function App() {
  // Show onboarding only on the very first visit (no flag in localStorage yet).
  const [showOnboarding, setShowOnboarding] = useState<boolean>(
    () => !localStorage.getItem(ONBOARDING_KEY)
  );

  const { updateProfile } = useProfile();

  const handleOnboardingComplete = (profile: StudentProfile) => {
    // Persist profile collected during onboarding
    updateProfile(profile);
    // Mark onboarding as done so it never shows again
    localStorage.setItem(ONBOARDING_KEY, "1");
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return (
      <div className="flex h-full w-full p-4 items-center justify-center">
        <div className="w-full max-w-xl h-full max-h-[700px]">
          <Onboarding onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  return <ChatPage />;
}
