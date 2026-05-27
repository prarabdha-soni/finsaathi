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

const MOCK_REPLIES = [
  "Got it — running this against your profile. One moment…",
  "Based on your ₹65K income and current 80C usage, here's what I recommend…",
  "Good question. Your CIBIL dropped 6 points last month because of a hard inquiry from Bajaj Finserv.",
  "The Nifty volatility is normal. Your SIPs are averaging down — that's actually good for long-term returns.",
  "I've drafted a dispute letter for the Aug 2024 late payment. Want me to open it?",
];

let replyIdx = 0;

interface ChatState {
  messages: ChatMessage[];
  addMessage: (text: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: INITIAL_MESSAGES,
  addMessage: (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      from: "me",
      text,
    };
    set((s) => ({ messages: [...s.messages, userMsg] }));

    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        from: "them",
        text: MOCK_REPLIES[replyIdx % MOCK_REPLIES.length],
      };
      replyIdx++;
      set((s) => ({ messages: [...s.messages, reply] }));
    }, 650);
  },
}));
