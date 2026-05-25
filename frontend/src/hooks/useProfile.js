import { useState } from "react";
const STORAGE_KEY = "scholarpath_profile";
function loadProfile() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    }
    catch {
        return {};
    }
}
export function useProfile() {
    const [profile, setProfile] = useState(loadProfile);
    const updateProfile = (p) => {
        setProfile(p);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    };
    return { profile, updateProfile };
}
