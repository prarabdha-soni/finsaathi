"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { FSCard } from "@/components/shared/FSCard";

/* Storage key */
const KEY = (n: number) => `fs:onb:q${n}`;

/* Question types */
type ChipQ = { type: "chips"; options: string[]; multi: boolean };
type GridQ = { type: "grid"; options: { id: string; label: string; sub: string; emoji: string }[] };
type Question = {
  id: number;
  phase: string;
  phaseColor: string;
  q: string;
  nextQ: string;
} & (ChipQ | GridQ);

const PHASES = [
  { label: "You",       qs: [1, 2, 3],        color: "var(--saffron-deep)" },
  { label: "Family",    qs: [4, 5, 6],        color: "var(--indigo)"       },
  { label: "Money",     qs: [7, 8, 9],        color: "var(--good-deep)"    },
  { label: "Protect",   qs: [10, 11, 12],     color: "var(--caution)"      },
];

function getPhaseLabel(q: number) {
  return PHASES.find((p) => p.qs.includes(q)) ?? PHASES[0];
}

const QUESTIONS: Question[] = [
  /* ── Phase 1: YOU ──────────────────── */
  {
    id: 1, phase: "You", phaseColor: "var(--saffron-deep)",
    q: "How old are you?",
    type: "chips",
    options: ["18–24", "25–30", "31–35", "36–45", "45+"],
    multi: false,
    nextQ: "/onboarding/personalise/2",
  },
  {
    id: 2, phase: "You", phaseColor: "var(--saffron-deep)",
    q: "Monthly take-home salary?",
    type: "chips",
    options: ["< ₹30K", "₹30–50K", "₹50–75K", "₹75K–1L", "> ₹1L"],
    multi: false,
    nextQ: "/onboarding/personalise/3",
  },
  {
    id: 3, phase: "You", phaseColor: "var(--saffron-deep)",
    q: "Where does most of your money go?",
    type: "grid",
    options: [
      { id: "family",    label: "Family & home",         sub: "Groceries, school, EMIs, parents",  emoji: "🏠" },
      { id: "lifestyle", label: "Eating out & travel",   sub: "Swiggy, Zomato, flights, hotels",   emoji: "✈️" },
      { id: "bills",     label: "Bills & subscriptions", sub: "Electricity, Netflix, broadband",   emoji: "📱" },
      { id: "saving",    label: "I save most of it",     sub: "Liquid funds, FDs, recurring",      emoji: "🪙" },
    ],
    nextQ: "/onboarding/personalise/4",
  },

  /* ── Phase 2: FAMILY ───────────────── */
  {
    id: 4, phase: "Family", phaseColor: "var(--indigo)",
    q: "Who depends on you financially?",
    type: "chips",
    options: ["Spouse / Partner", "Child (< 10)", "Child (10–18)", "Parents", "Siblings", "Just me"],
    multi: true,
    nextQ: "/onboarding/personalise/5",
  },
  {
    id: 5, phase: "Family", phaseColor: "var(--indigo)",
    q: "What are you saving for?",
    type: "grid",
    options: [
      { id: "education",  label: "Child's education",  sub: "School, college, abroad",          emoji: "🎓" },
      { id: "house",      label: "Buy / upgrade home",  sub: "Down payment or full purchase",    emoji: "🏠" },
      { id: "emergency",  label: "Emergency fund",      sub: "6 months expenses as backup",      emoji: "🛟" },
      { id: "retirement", label: "Retire comfortably",  sub: "Stop working at 55–60",            emoji: "🌅" },
    ],
    nextQ: "/onboarding/personalise/6",
  },
  {
    id: 6, phase: "Family", phaseColor: "var(--indigo)",
    q: "Your housing situation?",
    type: "chips",
    options: ["Own — no EMI", "Own — EMI running", "Renting", "Living with family"],
    multi: false,
    nextQ: "/onboarding/personalise/7",
  },

  /* ── Phase 3: MONEY ────────────────── */
  {
    id: 7, phase: "Money", phaseColor: "var(--good-deep)",
    q: "Do you have a credit card?",
    type: "chips",
    options: ["Yes · 1 card", "Yes · 2+ cards", "No — I pay by UPI", "Had one, closed it"],
    multi: false,
    nextQ: "/onboarding/personalise/8",
  },
  {
    id: 8, phase: "Money", phaseColor: "var(--good-deep)",
    q: "Any active loans?",
    type: "chips",
    options: ["Home loan", "Car loan", "Personal loan", "Education loan", "No loans"],
    multi: true,
    nextQ: "/onboarding/personalise/9",
  },
  {
    id: 9, phase: "Money", phaseColor: "var(--good-deep)",
    q: "Are you investing regularly?",
    type: "chips",
    options: ["SIPs monthly", "FDs / LIC", "Stocks myself", "Not yet"],
    multi: false,
    nextQ: "/onboarding/personalise/10",
  },

  /* ── Phase 4: PROTECT ──────────────── */
  {
    id: 10, phase: "Protect", phaseColor: "var(--caution)",
    q: "Do you have life insurance?",
    type: "chips",
    options: ["None at all", "Employer gives basic", "Own term plan", "LIC endowment"],
    multi: false,
    nextQ: "/onboarding/personalise/11",
  },
  {
    id: 11, phase: "Protect", phaseColor: "var(--caution)",
    q: "How do you feel about investment risk?",
    type: "grid",
    options: [
      { id: "safe",      label: "Play it safe",      sub: "FDs, debt funds, capital protection",   emoji: "🛡️" },
      { id: "balanced",  label: "Balanced growth",   sub: "Mix of equity + debt, moderate swings",  emoji: "⚖️" },
      { id: "aggressive",label: "Max returns",        sub: "Full equity, I can handle 30% drops",    emoji: "🚀" },
      { id: "unsure",    label: "Not sure yet",       sub: "Let Saathi recommend what's right",       emoji: "🤔" },
    ],
    nextQ: "/onboarding/personalise/12",
  },
  {
    id: 12, phase: "Protect", phaseColor: "var(--caution)",
    q: "What should Saathi help with first?",
    type: "grid",
    options: [
      { id: "protect", label: "Protect my family",  sub: "Term, health, critical illness",   emoji: "🛡️" },
      { id: "grow",    label: "Grow my wealth",      sub: "SIPs, goals, index funds",         emoji: "📈" },
      { id: "credit",  label: "Fix my credit",       sub: "CIBIL, card strategy, loans",     emoji: "💳" },
      { id: "tax",     label: "Save on taxes",        sub: "80C, NPS, HRA, regime choice",    emoji: "📋" },
    ],
    nextQ: "/onboarding/finscore",
  },
];

/* Labels shown in the "What Saathi figured out" panel */
const ANSWERED_LABELS: Record<number, string> = {
  1:  "Your age?",
  2:  "Monthly income?",
  3:  "Where money goes?",
  4:  "Who depends on you?",
  5:  "Saving for?",
  6:  "Housing?",
  7:  "Credit card?",
  8:  "Active loans?",
  9:  "Investing?",
  10: "Life insurance?",
  11: "Risk tolerance?",
};

/* Dynamic inferred card items — show progressively */
function getInferred(qNum: number, answers: Record<number, string[]>): [string, string][] {
  const inferred: [string, string][] = [];
  const income = answers[2]?.[0] ?? "";
  const hasLoans = (answers[8] ?? []).some((a) => a !== "No loans");
  const hasCard = (answers[7]?.[0] ?? "").startsWith("No") ? false : true;
  const investing = answers[9]?.[0] ?? "";
  const insurance = answers[10]?.[0] ?? "";
  const dependents = answers[4] ?? [];
  const goals = answers[5] ?? [];

  if (qNum >= 3 && income) {
    const sipCapacity =
      income.includes("> ₹1L") ? "~₹15,000/mo" :
      income.includes("₹75K") ? "~₹10,000/mo" :
      income.includes("₹50") ? "~₹7,000/mo" :
      income.includes("₹30") ? "~₹4,000/mo" : "~₹2,500/mo";
    inferred.push(["SIP capacity", sipCapacity]);
  }

  if (qNum >= 5 && dependents.length > 0 && !dependents.includes("Just me")) {
    const termCover =
      income.includes("> ₹1L") ? "₹1.5–2 Cr" :
      income.includes("₹75K") ? "₹1–1.5 Cr" :
      income.includes("₹50") ? "₹75L–1 Cr" : "₹50–75L";
    inferred.push(["Term cover needed", termCover]);
  }

  if (qNum >= 6 && goals.includes("emergency")) {
    inferred.push(["Emergency fund target", "6 × monthly expenses"]);
  }

  if (qNum >= 8 && !hasCard) {
    inferred.push(["Cashback opportunity", "₹5,000–8,000/yr unclaimed"]);
  }

  if (qNum >= 10 && (insurance === "None at all" || insurance === "Employer gives basic")) {
    inferred.push(["Gap in protection", "Family has ₹0 term cover"]);
  }

  if (qNum >= 11 && investing === "Not yet") {
    inferred.push(["Wealth gap", "₹0 invested · time to start"]);
  }

  return inferred.slice(0, 4);
}

const NEXT_Q_PREVIEWS: Record<number, string> = {
  1:  '"Monthly take-home salary?"',
  2:  '"Where does money go each month?"',
  3:  '"Who depends on you financially?"',
  4:  '"What are you saving for?"',
  5:  '"Your housing situation?"',
  6:  '"Do you have a credit card?"',
  7:  '"Any active loans?"',
  8:  '"Are you investing regularly?"',
  9:  '"Do you have life insurance?"',
  10: '"How do you feel about investment risk?"',
  11: '"What should Saathi focus on first?"',
};

export default function PersonalisePage() {
  const { q } = useParams<{ q: string }>();
  const router = useRouter();
  const qNum = Math.max(1, Math.min(12, parseInt(q ?? "1", 10)));
  const question = QUESTIONS[qNum - 1];

  const [selected, setSelected] = useState<string[]>([]);
  const [allAnswers, setAllAnswers] = useState<Record<number, string[]>>({});

  /* Restore saved answers on mount */
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(KEY(qNum)) : null;
    if (saved) {
      try { setSelected(JSON.parse(saved)); } catch { /* noop */ }
    } else {
      setSelected([]);
    }
    /* Load all previous answers for inferred panel */
    const prev: Record<number, string[]> = {};
    for (let i = 1; i < qNum; i++) {
      const raw = typeof window !== "undefined" ? localStorage.getItem(KEY(i)) : null;
      if (raw) { try { prev[i] = JSON.parse(raw); } catch { /* noop */ } }
    }
    setAllAnswers(prev);
  }, [qNum]);

  const prevAnswered = Array.from({ length: qNum - 1 }, (_, i) => {
    const val = allAnswers[i + 1];
    if (!val) return null;
    return { q: ANSWERED_LABELS[i + 1] ?? `Q${i + 1}`, a: val.join(", ") };
  }).filter(Boolean) as { q: string; a: string }[];

  function toggle(opt: string) {
    if (question.type === "grid") { setSelected([opt]); return; }
    const isMulti = (question as ChipQ).multi;
    if (!isMulti) { setSelected([opt]); return; }
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]
    );
  }

  function handleContinue() {
    if (selected.length === 0) return;
    if (typeof window !== "undefined") {
      localStorage.setItem(KEY(qNum), JSON.stringify(selected));
    }
    router.push(question.nextQ);
  }

  const canContinue = selected.length > 0;
  const phase = getPhaseLabel(qNum);
  const inferred = getInferred(qNum, allAnswers);

  return (
    <div
      className="flex-1 flex flex-col"
      style={{ background: "var(--surface-2)" }}
    >
      {/* Progress header */}
      <div className="shrink-0 px-5 pt-4 pb-2">
        <div className="flex items-center gap-2.5 mb-3">
          <button
            aria-label="Back"
            onClick={() => router.back()}
            className="w-9 h-9 rounded-[12px] flex items-center justify-center hover:bg-surface-3 transition-colors shrink-0"
          >
            <ArrowLeft size={18} strokeWidth={1.8} className="text-ink-2" />
          </button>

          {/* Phase label */}
          <div className="flex-1">
            <span
              className="text-[10px] font-bold tracking-[0.1em] uppercase"
              style={{ color: phase.color }}
            >
              {phase.label} · step {qNum} of 12
            </span>
          </div>

          <span
            className="tnum text-[11px] font-bold shrink-0"
            style={{ color: "var(--ink-3)" }}
          >
            {qNum}/12
          </span>
        </div>

        {/* Progress bar — 12 segments */}
        <div className="flex gap-[3px]">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="flex-1 h-[4px] rounded-full transition-all duration-300"
              style={{
                background:
                  i < qNum - 1 ? "var(--saffron)"
                  : i === qNum - 1 ? "var(--saffron-soft)"
                  : "var(--hairline)",
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {/* Saathi voice */}
        <div className="flex items-center gap-2 mb-4 mt-3">
          <div className="relative shrink-0">
            <Logo size={28} />
            <span
              className="absolute -right-0.5 -bottom-0.5 w-[9px] h-[9px] rounded-full border-2"
              style={{ background: "var(--good)", borderColor: "var(--surface-2)" }}
            />
          </div>
          <div className="eyebrow" style={{ color: "var(--saffron-deep)" }}>
            Saathi is learning · 2 min to your plan
          </div>
        </div>

        {/* Question */}
        <h1
          className="text-[30px] font-medium text-ink leading-[1.15] tracking-[-0.01em]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {question.q.split(" ").slice(0, -1).join(" ")}{" "}
          <em className="italic" style={{ color: phase.color }}>
            {question.q.split(" ").at(-1)}
          </em>
        </h1>

        {/* Chip options */}
        {question.type === "chips" && (
          <div className="flex flex-wrap gap-2 mt-5">
            {(question as ChipQ).options.map((opt) => {
              const on = selected.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggle(opt)}
                  className="px-4 h-10 rounded-[12px] text-[14px] font-semibold transition-all duration-150"
                  style={{
                    background: on ? "var(--tint-saffron)" : "var(--surface)",
                    border: `1.5px solid ${on ? "var(--saffron)" : "var(--hairline)"}`,
                    color: on ? "var(--saffron-ink)" : "var(--ink)",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Grid options */}
        {question.type === "grid" && (
          <div className="grid grid-cols-2 gap-2.5 mt-5">
            {(question as GridQ).options.map((opt) => {
              const on = selected.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggle(opt.id)}
                  className="relative flex flex-col gap-1.5 p-4 rounded-[18px] text-left transition-all duration-150 min-h-[130px]"
                  style={{
                    background: on ? "var(--tint-saffron)" : "var(--surface)",
                    border: `1.5px solid ${on ? "var(--saffron)" : "var(--hairline)"}`,
                  }}
                >
                  {on && (
                    <span className="absolute top-2.5 right-2.5 w-[20px] h-[20px] rounded-full bg-saffron text-[#fff8ef] flex items-center justify-center text-[11px] font-bold">
                      ✓
                    </span>
                  )}
                  <span className="text-[26px] leading-none">{opt.emoji}</span>
                  <span
                    className="text-[13px] font-bold mt-1"
                    style={{ color: on ? "var(--saffron-ink)" : "var(--ink)" }}
                  >
                    {opt.label}
                  </span>
                  <span
                    className="text-[11px] leading-[1.4]"
                    style={{ color: on ? "var(--saffron-ink)" : "var(--ink-3)" }}
                  >
                    {opt.sub}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Saathi inference panel — appears from Q3 onwards */}
        {prevAnswered.length >= 2 && (
          <div className="mt-5">
            <div className="eyebrow mb-2">What Saathi is figuring out</div>
            <FSCard tone="white" pad={14}>
              {/* Previous answers */}
              {prevAnswered.slice(-4).map((a, i, arr) => (
                <div
                  key={i}
                  className="flex justify-between items-baseline py-[7px] text-[12px]"
                  style={{
                    borderBottom: i < arr.length - 1 || inferred.length > 0
                      ? "1px dashed var(--hairline)" : "none",
                  }}
                >
                  <span style={{ color: "var(--ink-3)" }}>{a.q}</span>
                  <span className="text-ink font-bold">{a.a}</span>
                </div>
              ))}

              {/* Inferred insights */}
              {inferred.length > 0 && (
                <div
                  className="mt-2.5 p-3 rounded-[10px]"
                  style={{ background: "var(--tint-saffron)" }}
                >
                  <div className="eyebrow mb-2" style={{ fontSize: 10, color: "var(--saffron-deep)" }}>
                    Based on what you said
                  </div>
                  <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
                    {inferred.map(([label, val]) => (
                      <li key={label} className="flex justify-between text-[12px]">
                        <span style={{ color: "var(--saffron-ink)" }}>{label}</span>
                        <span className="font-bold" style={{ color: "var(--saffron-deep)" }}>{val}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </FSCard>
          </div>
        )}

        {/* Next question preview */}
        {qNum < 12 && NEXT_Q_PREVIEWS[qNum] && (
          <div
            className="mt-4 p-3 rounded-[12px] border border-dashed flex gap-2.5 items-center"
            style={{ background: "var(--surface)", borderColor: "var(--hairline-2)" }}
          >
            <span className="text-[11px] font-bold tracking-[0.06em] shrink-0" style={{ color: "var(--ink-3)" }}>
              NEXT
            </span>
            <span className="text-[12px] flex-1" style={{ color: "var(--ink-3)" }}>
              {NEXT_Q_PREVIEWS[qNum]}
            </span>
            <ChevronRight size={14} strokeWidth={2} style={{ color: "var(--ink-3)" }} className="shrink-0" />
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div
        className="shrink-0 px-5 pt-3.5 pb-7 border-t border-hairline"
        style={{ background: "rgba(250,245,235,0.96)" }}
      >
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full h-[54px] rounded-[14px] text-[15px] font-semibold flex items-center justify-center gap-2 transition-all duration-200"
          style={{
            background: canContinue ? "var(--saffron)" : "var(--surface-3)",
            color: canContinue ? "#fff8ef" : "var(--ink-3)",
            boxShadow: canContinue
              ? "0 1px 0 rgba(255,255,255,0.25) inset, 0 1px 2px rgba(168,85,34,0.35)"
              : "none",
          }}
        >
          {qNum === 12 ? "Build my plan →" : "Continue"}
          <ChevronRight size={18} strokeWidth={2.4} />
        </button>
        <p className="text-center text-[11px] mt-2" style={{ color: "var(--ink-3)" }}>
          {qNum === 12
            ? "Takes 10 seconds · no account needed yet"
            : `${12 - qNum} question${12 - qNum === 1 ? "" : "s"} left · your plan is taking shape`}
        </p>
      </div>
    </div>
  );
}
