"use client";

import React, { createContext, useContext } from "react";
import { useProfileService } from "./useProfileService";

type ProfileValue = ReturnType<typeof useProfileService>;

const ProfileContext = createContext<ProfileValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  // Mount the original hook once here; it will fetch on mount
  const value = useProfileService();
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return ctx;
}

