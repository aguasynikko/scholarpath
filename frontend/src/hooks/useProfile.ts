import { useState } from "react";
import type { StudentProfile } from "@/types/api";

const STORAGE_KEY = "scholarpath_profile";

function loadProfile(): StudentProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function useProfile() {
  const [profile, setProfile] = useState<StudentProfile>(loadProfile);

  const updateProfile = (p: StudentProfile) => {
    setProfile(p);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  };

  return { profile, updateProfile };
}
