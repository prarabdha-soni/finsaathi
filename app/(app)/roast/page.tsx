"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Plus, Trash2, Flame, Sparkles,
  ChevronRight, AlertTriangle,
} from "lucide-react";
import { FSCard } from "@/components/shared/FSCard";
import { Pill } from "@/components/shared/Pill";

type Phase = "input" | "loading" | "result";

interface Holding {
  id: string;
  name: string;
  allocation: number;
}

interface RoastResult {
  score: number;
  roast: string;
  riskLevel: string;
  biggestIssue: string;
  fixes: string[];
}

const PRESET_HOLDINGS = [
  "Nifty 50 Index Fund",
  "Reliance Industries",
  "HDFC Bank",
  "SGB – Sovereign Gold Bond",
  "Fixed Deposit",
  "Small Cap Fund",
  "US Tech ETF",
  "PPF",
  "Real Estate",
  "Bitcoin / Crypto",
];

function scoreColor(s: number) {
  if (s >= 75) return "var(--good)";
  if (s >= 50) return "var(--caution)";
  return "var(--bad)";
}

function scoreLabel(s: number) {
  if (s >= 80) return "Solid";
  if (s >= 65) return "Decent";
  if (s >= 50) return "Needs work";
  if (s >= 35) return "Risky";
  return "Ouch";
}

function riskColor(level: string) {
  switch (level) {
    case "Conservative": return "var(--good)";
    case "Balanced":     return "var(--indigo)";
    case "Aggressive":   return "var(--caution)";
    case "Reckless":     return "var(--bad)";
    default:             return "var(--ink-2)";
  }
}

export default function RoastPage() {
  const [phase, setPhase]       = useState<Phase>("input");
  const [holdings, setHoldings] = useState<Holding[]>([
    { id: "1", name: "Reliance Industries",        allocation: 35 },
    { id: "2", name: "Nifty 50 Index Fund",        allocation: 25 },
    { id: "3", name: "Small Cap Fund",             allocation: 20 },
    { id: "4", name: "Fixed Deposit",              allocation: 15 },
    { id: "5", name: "SGB – Sovereign Gold Bond",  allocation: 5  },
  ]);
  const [result, setResult]     = useState<RoastResult | null>(null);
  const [error, setError]       = useState("");

  const totalAlloc = holdings.reduce((s, h) => s + (h.allocation || 0), 0);
  const validCount = holdings.filter(h => h.name.trim() && h.allocation > 0).length;
  const canRoast   = validCount >= 2;

  function addHolding() {
    setHoldings(p => [...p, { id: Date.now().toString(), name: "", allocation: 0 }]);
  }

  function update(id: string, field: "name" | "allocation", val: string | number) {
    setHoldings(p => p.map(h => h.id === id ? { ...h, [field]: val } : h));
  }

  function remove(id: string) {
    if (holdings.length <= 1) return;
    setHoldings(p => p.filter(h => h.id !== id));
  }

  async function handleRoast() {
    const valid = holdings.filter(h => h.name.trim() && h.allocation > 0);
    setPhase("loading");
    setError("");
    try {
      const res  = await fetch("/api/roast", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ holdings: valid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API failed");
      setResult(data);
      setPhase("result");
    } catch (e) {
      setError((e as Error).message || "Something went wrong. Check your API key.");
      setPhase("input");
    }
  }

  function reset() {
    setResult(null);
    setHoldings([
      { id: "1", name: "Reliance Industries",        allocation: 35 },
      { id: "2", name: "Nifty 50 Index Fund",        allocation: 25 },
      { id: "3", name: "Small Cap Fund",             allocation: 20 },
      { id: "4", name: "Fixed Deposit",              allocation: 15 },
      { id: "5", name: "SGB – Sovereign Gold Bond",  allocation: 5  },
    ]);
    setPhase("input");
  }

  const circumference = 2 * Math.PI * 34;

  return (
    <div className="min-h-full pb-10" style={{ background: "var(--surface-2)" }}>

      {/* ── Sticky header ──────────────────────────────────── */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-hairline"
        style={{ background: "rgba(246,239,225,0.96)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-2.5">
          <Link href="/home">
            <button
              aria-label="Back"
              className="w-9 h-9 rounded-[12px] flex items-center justify-center hover:bg-surface-3 transition-colors"
            >
              <ArrowLeft size={18} strokeWidth={1.8} className="text-ink-2" />
            </button>
          </Link>
          <div>
            <div className="text-[16px] font-bold text-ink leading-tight">Portfolio Roast</div>
            <div className="text-[11px] font-medium" style={{ color: "var(--ink-3)" }}>
              {phase === "result" ? "Analysis complete" : "AI-powered portfolio review"}
            </div>
          </div>
        </div>
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
          style={{ background: "rgba(239,68,68,0.12)", color: "#dc2626" }}
        >
          <Flame size={11} strokeWidth={2} />
          AI
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ════════════════════════════════
            PHASE 1 — INPUT
        ════════════════════════════════ */}
        {phase === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.22 }}
            className="px-4 pt-4 flex flex-col gap-3"
          >
            {/* Hero */}
            <div
              className="rounded-[18px] px-5 py-5 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #f5f0ff 0%, #ede8fa 60%, #e8f0fe 100%)",
                border: "1.5px solid rgba(139,92,246,0.16)",
              }}
            >
              <div
                className="absolute -right-6 -top-6 w-36 h-36 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(139,92,246,0.1), transparent 65%)" }}
              />
              <div className="text-[10px] font-bold tracking-[0.1em] uppercase relative" style={{ color: "rgba(109,40,217,0.5)" }}>
                AI Portfolio Review
              </div>
              <div
                className="text-[22px] font-medium mt-1.5 leading-[1.2] relative"
                style={{ fontFamily: "var(--font-display)", color: "#1e0a3c" }}
              >
                Let AI <em className="italic" style={{ color: "#7c3aed" }}>roast</em><br />your portfolio.
              </div>
              <p className="text-[12px] mt-2.5 leading-[1.5] relative" style={{ color: "rgba(46,16,101,0.5)" }}>
                Enter your holdings. AI judges them ruthlessly and gives a concrete fix plan.
              </p>
            </div>

            {/* Holdings */}
            <div>
              <div className="flex items-center justify-between mb-2 px-0.5">
                <span className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ color: "var(--ink-3)" }}>
                  Your holdings
                </span>
                <span
                  className="text-[11px] font-bold tabular-nums"
                  style={{
                    color: totalAlloc > 100
                      ? "var(--bad)"
                      : totalAlloc === 100
                        ? "var(--good)"
                        : "var(--ink-3)",
                  }}
                >
                  {totalAlloc}% / 100%
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {holdings.map((h, i) => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8, height: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <FSCard tone="white" pad={13}>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            placeholder={`Asset ${i + 1} — e.g. Nifty 50 Index`}
                            value={h.name}
                            onChange={e => update(h.id, "name", e.target.value)}
                            list="holding-presets"
                            className="w-full text-[13px] font-medium bg-transparent outline-none placeholder:text-ink-3 text-ink"
                          />
                          <datalist id="holding-presets">
                            {PRESET_HOLDINGS.map(p => <option key={p} value={p} />)}
                          </datalist>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <input
                            type="number"
                            placeholder="0"
                            min={0}
                            max={100}
                            value={h.allocation || ""}
                            onChange={e => update(h.id, "allocation", parseFloat(e.target.value) || 0)}
                            className="w-11 text-[13px] font-bold text-right bg-transparent outline-none text-ink tabular-nums"
                          />
                          <span className="text-[12px] font-bold" style={{ color: "var(--ink-3)" }}>%</span>
                        </div>
                        <button
                          onClick={() => remove(h.id)}
                          className="w-7 h-7 rounded-[8px] flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity"
                          style={{ color: "var(--ink-3)" }}
                        >
                          <Trash2 size={13} strokeWidth={2} />
                        </button>
                      </div>
                    </FSCard>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={addHolding}
                className="mt-2 w-full h-10 rounded-[12px] flex items-center justify-center gap-1.5 text-[12px] font-bold transition-colors hover:bg-surface-3"
                style={{ border: "1.5px dashed var(--hairline)", color: "var(--ink-3)" }}
              >
                <Plus size={14} strokeWidth={2.5} />
                Add holding
              </button>
            </div>

            {error && (
              <div
                className="p-3 rounded-[12px] text-[12px] leading-[1.45]"
                style={{ background: "#fde8e4", color: "var(--bad)" }}
              >
                {error}
              </div>
            )}

            <button
              onClick={handleRoast}
              disabled={!canRoast}
              className="w-full h-12 rounded-[14px] flex items-center justify-center gap-2 text-[15px] font-bold transition-all active:scale-[0.98]"
              style={{
                background: canRoast ? "#7c3aed"        : "var(--surface-3)",
                color:      canRoast ? "#fff"            : "var(--ink-3)",
                cursor:     canRoast ? "pointer"         : "not-allowed",
              }}
            >
              <Flame size={17} strokeWidth={2} style={{ color: canRoast ? "#ddd6fe" : "var(--ink-3)" }} />
              Roast My Portfolio
            </button>
          </motion.div>
        )}

        {/* ════════════════════════════════
            PHASE 2 — LOADING
        ════════════════════════════════ */}
        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center gap-8 px-6"
            style={{ minHeight: "65vh" }}
          >
            <div className="flex items-end gap-1">
              {[0.7, 1.1, 0.85, 1.2, 0.75, 1.0, 0.9].map((scale, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scaleY: [1, scale * 1.35, 1],
                    opacity: [0.75, 1, 0.75],
                  }}
                  transition={{
                    duration: 0.55 + i * 0.07,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.08,
                  }}
                  style={{
                    fontSize: `${22 + i * 3}px`,
                    transformOrigin: "bottom center",
                    lineHeight: 1,
                  }}
                >
                  🔥
                </motion.div>
              ))}
            </div>

            <div className="text-center space-y-2">
              <div
                className="text-[20px] font-medium leading-[1.3]"
                style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
              >
                AI is judging<br />your choices…
              </div>
              <motion.p
                animate={{ opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="text-[12px]"
                style={{ color: "var(--ink-3)" }}
              >
                Analysing allocations · checking risk · preparing roast
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════
            PHASE 3 — RESULT
        ════════════════════════════════ */}
        {phase === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 pt-4 flex flex-col gap-3"
          >
            {/* Score hero card */}
            <div
              className="rounded-[20px] px-5 py-5 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #f5f0ff 0%, #ede8fa 60%, #e8f0fe 100%)",
                border: "1.5px solid rgba(139,92,246,0.16)",
              }}
            >
              <div
                className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${scoreColor(result.score)}18, transparent 65%)` }}
              />
              <div className="flex items-center gap-4 relative">
                {/* Animated score ring */}
                <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                  <svg width={80} height={80} className="absolute" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx={40} cy={40} r={34} fill="none" strokeWidth={7} stroke="rgba(139,92,246,0.12)" />
                    <motion.circle
                      cx={40} cy={40} r={34}
                      fill="none" strokeWidth={7}
                      stroke={scoreColor(result.score)}
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: circumference * (1 - result.score / 100) }}
                      transition={{ duration: 1.3, ease: "easeOut", delay: 0.2 }}
                    />
                  </svg>
                  <div className="z-10 text-center">
                    <motion.div
                      className="text-[24px] font-bold tabular-nums leading-none"
                      style={{ color: scoreColor(result.score) }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {result.score}
                    </motion.div>
                    <div className="text-[9px] font-semibold mt-0.5" style={{ color: "rgba(109,40,217,0.4)" }}>
                      / 100
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold tracking-[0.1em] uppercase" style={{ color: "rgba(109,40,217,0.5)" }}>
                    Portfolio Health
                  </div>
                  <div
                    className="text-[26px] font-medium mt-0.5 leading-tight"
                    style={{ fontFamily: "var(--font-display)", color: "#1e0a3c" }}
                  >
                    {scoreLabel(result.score)}
                  </div>
                  <div
                    className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      background: `${riskColor(result.riskLevel)}18`,
                      color: riskColor(result.riskLevel),
                    }}
                  >
                    <AlertTriangle size={9} strokeWidth={2.5} />
                    {result.riskLevel} risk
                  </div>
                </div>
              </div>
            </div>

            {/* The Roast */}
            <FSCard tone="white" pad={16}>
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 text-[17px]"
                  style={{ background: "rgba(239,68,68,0.1)" }}
                >
                  🔥
                </div>
                <div>
                  <div className="text-[10px] font-extrabold tracking-[0.1em] uppercase" style={{ color: "#dc2626" }}>
                    The Roast
                  </div>
                  <div className="text-[10px]" style={{ color: "var(--ink-3)" }}>
                    Biggest issue: {result.biggestIssue}
                  </div>
                </div>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="text-[14px] leading-[1.6] font-medium"
                style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}
              >
                &ldquo;{result.roast}&rdquo;
              </motion.p>
            </FSCard>

            {/* Fix plan */}
            <div>
              <div className="flex items-center gap-1.5 mb-2 px-0.5">
                <Sparkles size={12} strokeWidth={2} style={{ color: "var(--good)" }} />
                <span className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ color: "var(--ink-3)" }}>
                  AI Fix Plan
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {result.fixes.map((fix, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.12, duration: 0.22 }}
                  >
                    <FSCard tone="white" pad={14}>
                      <div className="flex items-start gap-3">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold"
                          style={{ background: "var(--tint-green)", color: "var(--good-deep)" }}
                        >
                          {i + 1}
                        </div>
                        <p className="text-[13px] leading-[1.5]" style={{ color: "var(--ink)" }}>
                          {fix}
                        </p>
                      </div>
                    </FSCard>
                  </motion.div>
                ))}
              </div>
            </div>


            {/* Roast again */}
            <button
              onClick={reset}
              className="w-full h-11 rounded-[14px] flex items-center justify-center gap-2 text-[14px] font-semibold border border-hairline active:scale-[0.98] transition-transform"
              style={{ color: "var(--ink-2)" }}
            >
              Roast a different portfolio
              <ChevronRight size={14} strokeWidth={2} />
            </button>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
