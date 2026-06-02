"use client";
import { useState, useEffect } from "react";
import { generatePersonaFromAnswers, type DynamicPersona, type OnboardingAnswers } from "./generatePersona";

export const LS_KEY = "finsaathi:answers";

export function usePersona(): DynamicPersona | null {
  const [persona, setPersona] = useState<DynamicPersona | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      setPersona(generatePersonaFromAnswers(JSON.parse(raw) as OnboardingAnswers));
    } catch {
      // ignore corrupt data
    }
  }, []);

  return persona;
}
