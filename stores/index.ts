"use client";
import { create } from "zustand";
import { rahul } from "@/lib/personas";

/* ── User / persona store ──────────────────────────────────── */
interface UserState {
  name: string;
  lang: "EN" | "HI";
  setLang: (l: "EN" | "HI") => void;
  onboarded: boolean;
  setOnboarded: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: rahul.firstName,
  lang: "EN",
  setLang: (lang) => set({ lang }),
  onboarded: false,
  setOnboarded: () => set({ onboarded: true }),
}));

/* ── FinScore store ────────────────────────────────────────── */
interface FinScoreState {
  score: number;
  grade: string;
  delta: number;
  dimensions: typeof rahul.dimensions;
}

export const useFinScoreStore = create<FinScoreState>(() => ({
  score: rahul.finScore,
  grade: rahul.finScoreGrade,
  delta: rahul.finScoreDelta,
  dimensions: rahul.dimensions,
}));

/* ── Chat store ────────────────────────────────────────────── */
export interface ChatMessage {
  id: string;
  from: "me" | "them";
  text: string;
  kind?: "card";
  card?: string;
  time?: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    from: "them",
    text: "Good morning Rahul. I noticed your home loan EMI hits tomorrow — ₹24,800. Want a quick check on the month?",
  },
  { id: "2", from: "me", text: "Yes. Also — is now a good time to start ELSS?" },
  { id: "3", from: "them", kind: "card", card: "elss", text: "Two answers in one. Quick read:" },
  {
    id: "4",
    from: "them",
    text: "For ELSS specifically: yes — you have ₹12,000 of 80C headroom left, and starting now gives 10 months of SIP before March. I would not lumpsum.",
  },
];

interface ChatState {
  messages:       ChatMessage[];
  addUserMessage: (text: string) => void;
  /** Appends an empty bot bubble and returns its id — for streaming. */
  addBotMessage:  (text?: string) => string;
  /** Patch an existing message's text in-place (used during streaming). */
  updateMessage:  (id: string, text: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: INITIAL_MESSAGES,

  addUserMessage: (text: string) =>
    set((s) => ({
      messages: [
        ...s.messages,
        { id: Date.now().toString(), from: "me" as const, text },
      ],
    })),

  addBotMessage: (text = "") => {
    const id = (Date.now() + 1).toString();
    set((s) => ({
      messages: [
        ...s.messages,
        { id, from: "them" as const, text },
      ],
    }));
    return id;
  },

  updateMessage: (id: string, text: string) =>
    set((s) => ({
      messages: s.messages.map((m) => (m.id === id ? { ...m, text } : m)),
    })),
}));
