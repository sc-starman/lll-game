"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import OnboardingPopup from "./Onboarding";
import { useProfile } from "@/contexts/ProfileContext";
const STORAGE_KEY = "lll_onboarding_seen_v4";

export function OnboardingInfoButton() {
  const [storageKey, setStorageKey] = useState(STORAGE_KEY);
  const { toggleNavigation } = useProfile();

  return (
    <>
      {/* Info Button */}
      <button
        onClick={() => {
          toggleNavigation()
          setStorageKey(`${storageKey}${Math.random()}`)
        }}
        aria-label="Show onboarding info"
        className="relative flex h-8 w-8 items-center justify-center rounded-full
                   border border-white/10 bg-white/[0.08] backdrop-blur-md
                   hover:bg-white/[0.15] transition active:scale-95
                   shadow-[0_0_10px_rgba(0,0,0,0.25)]"
      >
        <Info className="h-4 w-4 text-neon-cyan" />
        <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r 
                        from-neon-cyan/20 to-neon-pink/20 opacity-0 hover:opacity-100 blur-sm 
                        transition-opacity" />
      </button>

      {/* Onboarding Popup */}
      {/* {showOnboarding && ( */}
      <OnboardingPopup storageKey={storageKey} key={storageKey}/>
      {/* )} */}
    </>
  );
}
