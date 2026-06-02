"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, Send, Zap } from "lucide-react";
import { Logo }             from "@/components/shared/Logo";
import { LangSwitch }       from "@/components/shared/LangSwitch";
import { ChatBubble, MonthAtAGlanceCard } from "@/components/chat/ChatBubble";
import { useChatStore }     from "@/stores";

const CHIPS = [
  "What's my CIBIL score?",
  "How much can I save on tax?",
  "Start ELSS SIP",
  "Review my insurance",
];

export default function SaathiPage() {
  const { messages, addUserMessage, addBotMessage } = useChatStore();
  const [draft, setDraft]        = useState("");
  const [busy, setBusy]          = useState(false);
  const bottomRef                = useRef<HTMLDivElement>(null);
  const inputRef                 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    setDraft("");
    setBusy(true);
    addUserMessage(t);

    try {
      const history = messages.slice(-8).map(m => ({
        role: (m.from === "me" ? "user" : "assistant") as "user" | "assistant",
        content: m.text,
      }));
      const res  = await fetch("/api/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ message: t, history }),
      });
      const data = await res.json();
      addBotMessage(data.reply ?? "Something went wrong — try again.");
    } catch {
      addBotMessage("Couldn't reach Saathi right now. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(draft);
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg-app">
      {/* ── Header ─────────────────────────────────── */}
      <header
        className="shrink-0 sticky top-0 z-10 px-[18px] pt-3 pb-2.5 flex items-center justify-between gap-3"
        style={{
          background: "var(--bg-app)",
          borderBottom: "1px solid var(--hairline)",
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Logo with green online dot */}
          <div className="relative shrink-0">
            <Logo size={34} />
            <span
              className="absolute bottom-0 right-0 w-[9px] h-[9px] rounded-full bg-green-500 ring-2 ring-bg-app"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div
                className="text-[17px] font-bold text-ink leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Saathi
              </div>
              <span
                className="inline-flex items-center gap-[3px] px-1.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-[0.05em]"
                style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}
              >
                <Zap size={8} strokeWidth={2.5} />
                OpenRouter
              </span>
            </div>
            <div className="text-[11px] text-muted mt-0.5">
              Online · Hindi &amp; English · context aware
            </div>
          </div>
        </div>
        <LangSwitch />
      </header>

      {/* ── Messages ───────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-[14px] py-3 scrollbar-hide">
        {/* Day divider */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-px bg-hairline" />
          <span className="text-[10px] font-semibold text-muted uppercase tracking-[0.1em]">
            Today
          </span>
          <div className="flex-1 h-px bg-hairline" />
        </div>

        {messages.map((msg) => (
          <ChatBubble key={msg.id} from={msg.from} time={msg.time}>
            {msg.text}
            {msg.kind === "card" && msg.card === "elss" && (
              <MonthAtAGlanceCard />
            )}
          </ChatBubble>
        ))}

        {/* Typing indicator */}
        {busy && (
          <div className="flex gap-2 mb-2.5 justify-start">
            <Logo size={26} className="shrink-0 mt-1" />
            <div
              className="flex items-center gap-[5px] px-3.5 py-[11px] rounded-[18px] rounded-bl-[6px] bg-surface border border-hairline"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-[6px] h-[6px] rounded-full bg-muted"
                  style={{
                    animation: `typing-bounce 1.2s ${i * 0.2}s infinite ease-in-out`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Suggested chips ────────────────────────── */}
      <div
        className="shrink-0 px-[14px] pb-2 flex gap-2 overflow-x-auto scrollbar-hide"
        style={{ maskImage: "linear-gradient(to right, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)" }}
      >
        {CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => send(chip)}
            className="shrink-0 text-[12px] font-medium text-ink-2 px-3 py-1.5 rounded-full border border-hairline bg-surface whitespace-nowrap hover:border-saffron hover:text-saffron transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* ── Composer ───────────────────────────────── */}
      <div
        className="shrink-0 px-[14px] pt-2 pb-[calc(env(safe-area-inset-bottom)+10px)] flex items-center gap-2"
        style={{
          background: "var(--bg-app)",
          borderTop: "1px solid var(--hairline)",
        }}
      >
        {/* Mic */}
        <button
          className="shrink-0 w-[38px] h-[38px] flex items-center justify-center rounded-full bg-surface border border-hairline text-muted"
          aria-label="Voice input"
        >
          <Mic size={16} strokeWidth={2} />
        </button>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask anything about your money…"
          className="flex-1 h-[42px] bg-surface border border-hairline rounded-full px-4 text-[14px] text-ink placeholder:text-muted outline-none focus:border-saffron transition-colors"
        />

        {/* Send */}
        <button
          onClick={() => send(draft)}
          disabled={!draft.trim() || busy}
          className="shrink-0 w-[42px] h-[42px] rounded-full bg-saffron flex items-center justify-center transition-opacity"
          style={{
            opacity: draft.trim() && !busy ? 1 : 0.4,
            boxShadow: "0 1px 4px rgba(168,85,34,0.35)",
          }}
          aria-label="Send"
        >
          <Send size={16} strokeWidth={2} className="text-[#fff8ef] translate-x-[1px]" />
        </button>
      </div>

      {/* Keyframe for typing dots */}
      <style>{`
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30%            { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
