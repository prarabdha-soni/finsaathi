"use client";
/**
 * usePersona — reads the saved onboarding answers from localStorage
 * and returns a fully computed DynamicPersona.
 *
 * Returns null when:
 *  - running on the server (SSR)
 *  - no answers have been saved yet (user skipped onboarding)
 *
 * Uses a lazy useState initializer so the value is available synchronously
 * on the first client render — no flash of stale data.
 */
import { useState } from "react";
import { generatePersonaFromAnswers, type DynamicPersona, type OnboardingAnswers } from "./generatePersona";

export const LS_KEY = "finsaathi:answers";

export function usePersona(): DynamicPersona | null {
  const [persona] = useState<DynamicPersona | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      return generatePersonaFromAnswers(JSON.parse(raw) as OnboardingAnswers);
    } catch {
      return null;
    }
  });
  return persona;
}
