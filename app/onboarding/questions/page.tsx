"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Check, Sparkles } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

const TOTAL_STEPS = 9;

/* ── Answers ─────────────────────────────────────────────── */
interface Answers {
  age:        number;
  gender:     string;
  income:     number;       // monthly ₹
  dependents: string[];
  loans:      number;       // outstanding ₹ (0 = none)
  health:     string;
  existingCover: string;
  city:       string;
  goals:      string[];     // financial goals selected in step 9
}

const DEFAULTS: Answers = {
  age:          28,
  gender:       "",
  income:       65000,
  dependents:   [],
  loans:        2800000,
  health:       "",
  existingCover: "",
  city:         "",
  goals:        [],
};

/* ── Formatters ──────────────────────────────────────────── */
function fmtRupee(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(0)}L`;
  if (n >= 1000)     return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

/* ── Per-step insight copy ───────────────────────────────── */
function getInsight(step: number, ans: Answers): string {
  switch (step) {
    case 1: {
      const working = Math.max(0, 60 - ans.age);
      return `At ${ans.age}, you have ${working} working years ahead. Saathi will plan term cover till 60 — longer than most agents bother to mention.`;
    }
    case 2:
      return ans.gender === "Female"
        ? "Women live ~5 years longer than men. Your term cover cost is 10–15% lower — we'll find you the best rate."
        : "You're the financial backbone. Saathi sizes your cover to replace exactly what your family depends on.";
    case 3: {
      const annual = ans.income * 12;
      const cover  = annual * 15;
      return `₹${fmtRupee(ans.income)}/mo means your family needs ~${fmtRupee(cover)} to stay secure. We'll cross-check with your loans and goals.`;
    }
    case 4:
      return ans.dependents.length === 0
        ? "Planning ahead is smart. Premiums at your age are the lowest they'll ever be."
        : `${ans.dependents.length} dependent${ans.dependents.length > 1 ? "s" : ""} — we'll factor in each of them into your cover calculation.`;
    case 5:
      return ans.loans === 0
        ? "No loans — great! Your cover need is purely about income replacement."
        : `Your ${fmtRupee(ans.loans)} loan must be cleared even if you're gone. We add it on top of income cover.`;
    case 6:
      return "Be honest — insurers verify at claim time. Your answer determines the right product, not whether you qualify.";
    case 7:
      return ans.existingCover === "No cover at all"
        ? "Starting from zero means we size your cover precisely — no padding, no gap."
        : "We deduct what you have. You only buy what's actually missing.";
    case 8:
      return "Plans differ by state. Entering your city takes 5 seconds and saves weeks of searching the wrong products.";
    case 9:
      return ans.goals.length === 0
        ? "Each goal gets its own SIP, milestone tracker, and a Saathi nudge when you drift off course."
        : `${ans.goals.length} goal${ans.goals.length > 1 ? "s" : ""} selected — Saathi will build a personalised tracker with SIP amounts and timelines for each one.`;
    default:
      return "";
  }
}

/* ── Reusable chips ──────────────────────────────────────── */
function Chip({
  label, sub, emoji, selected, onClick, multi,
}: {
  label: string; sub?: string; emoji?: string;
  selected: boolean; onClick: () => void; multi?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex flex-col items-start gap-1 p-4 rounded-[16px] text-left w-full transition-all"
      style={{
        border:     `1.5px solid ${selected ? "var(--saffron)" : "var(--hairline)"}`,
        background: selected ? "var(--tint-saffron)" : "var(--surface)",
        boxShadow:  selected ? "0 0 0 1px var(--saffron)" : "none",
      }}
    >
      {multi && (
        <span
          className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
          style={{
            background: selected ? "var(--saffron)" : "transparent",
            border: `1.5px solid ${selected ? "var(--saffron)" : "var(--hairline-2)"}`,
          }}
        >
          {selected && <Check size={11} strokeWidth={3} color="#fff8ef" />}
        </span>
      )}
      {emoji && <span className="text-[22px] leading-none">{emoji}</span>}
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      {sub && <span className="text-[11px]" style={{ color: "var(--ink-3)" }}>{sub}</span>}
    </button>
  );
}

/* ── Big card (gender) ───────────────────────────────────── */
function BigCard({
  emoji, title, sub, selected, onClick,
}: {
  emoji: string; title: string; sub?: string;
  selected: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center gap-2.5 py-8 rounded-[20px] transition-all"
      style={{
        border:     `1.5px solid ${selected ? "var(--saffron)" : "var(--hairline)"}`,
        background: selected ? "var(--tint-saffron)" : "var(--surface)",
        boxShadow:  selected ? "0 0 0 1px var(--saffron)" : "none",
        minHeight:  140,
      }}
    >
      <span className="text-[36px] leading-none">{emoji}</span>
      <span className="text-[15px] font-bold text-ink">{title}</span>
      {sub && <span className="text-[11px] text-center px-3" style={{ color: "var(--ink-3)" }}>{sub}</span>}
    </button>
  );
}

/* ── Main form ───────────────────────────────────────────── */
function QuestionsForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const step = Math.max(1, Math.min(TOTAL_STEPS, Number(searchParams.get("step") ?? "1")));
  const [ans, setAns] = useState<Answers>(DEFAULTS);

  /* fill % for range track */
  const trackPct = (val: number, min: number, max: number) =>
    `${((val - min) / (max - min)) * 100}%`;

  const isValid = (): boolean => {
    if (step === 1) return ans.age >= 18 && ans.age <= 75;
    if (step === 2) return !!ans.gender;
    if (step === 3) return ans.income > 0;
    if (step === 4) return ans.dependents.length > 0;
    if (step === 5) return true; // loans optional
    if (step === 6) return !!ans.health;
    if (step === 7) return !!ans.existingCover;
    if (step === 8) return ans.city.trim().length >= 2;
    if (step === 9) return ans.goals.length > 0;
    return false;
  };

  const next = () => {
    if (!isValid()) return;
    if (step < TOTAL_STEPS) {
      router.push(`/onboarding/questions?step=${step + 1}`);
    } else {
      // Persist answers so finscore + home + invest pages can read them
      if (typeof window !== "undefined") {
        localStorage.setItem("finsaathi:answers", JSON.stringify(ans));
      }
      router.push("/onboarding/finscore");
    }
  };

  const back = () => {
    if (step > 1) router.push(`/onboarding/questions?step=${step - 1}`);
    else router.push("/onboarding/splash");
  };

  const toggleDep = (id: string) =>
    setAns((a) => ({
      ...a,
      dependents: a.dependents.includes(id)
        ? a.dependents.filter((d) => d !== id)
        : [...a.dependents, id],
    }));

  const toggleGoal = (id: string) =>
    setAns((a) => ({
      ...a,
      goals: a.goals.includes(id)
        ? a.goals.filter((g) => g !== id)
        : [...a.goals, id],
    }));

  /* ── Question text per step ──────────────────────────── */
  const STEPS: { headline: React.ReactNode; sub: string }[] = [
    {
      headline: <>How old are <em className="italic" style={{ color: "var(--saffron-deep)" }}>you</em>?</>,
      sub:      "आपकी उम्र क्या है? · We use this to set term cover length.",
    },
    {
      headline: <>What&apos;s your <em className="italic" style={{ color: "var(--saffron-deep)" }}>gender</em>?</>,
      sub:      "Gender · Affects premium by 10–15%.",
    },
    {
      headline: <>Your monthly <em className="italic" style={{ color: "var(--saffron-deep)" }}>income</em>?</>,
      sub:      "मासिक आय क्या है? · Used to calculate how much cover you need.",
    },
    {
      headline: <>Who <em className="italic" style={{ color: "var(--saffron-deep)" }}>depends</em> on you?</>,
      sub:      "आप पर कौन निर्भर है? · Select all that apply.",
    },
    {
      headline: <>Any outstanding <em className="italic" style={{ color: "var(--saffron-deep)" }}>loans</em>?</>,
      sub:      "बकाया लोन? · Home, car, personal — all of it.",
    },
    {
      headline: <>Any health <em className="italic" style={{ color: "var(--saffron-deep)" }}>conditions</em>?</>,
      sub:      "स्वास्थ्य · Honesty protects your family's claim.",
    },
    {
      headline: <>Existing life <em className="italic" style={{ color: "var(--saffron-deep)" }}>cover</em>?</>,
      sub:      "मौजूदा बीमा · We'll only add what's missing.",
    },
    {
      headline: <>Which <em className="italic" style={{ color: "var(--saffron-deep)" }}>city</em> are you in?</>,
      sub:      "आपका शहर? · For regional plan availability.",
    },
    {
      headline: <>What are your <em className="italic" style={{ color: "var(--saffron-deep)" }}>financial goals</em>?</>,
      sub:      "आपके लक्ष्य क्या हैं? · Pick all that matter — we'll build a tracker for each.",
    },
  ];

  const { headline, sub } = STEPS[step - 1];
  const valid   = isValid();
  const insight = getInsight(step, ans);

  /* ── Step body ───────────────────────────────────────── */
  function renderBody() {
    switch (step) {

      /* Step 1 — Age slider */
      case 1: {
        const pct = trackPct(ans.age, 18, 75);
        return (
          <div className="flex flex-col gap-5">
            {/* Large number */}
            <div className="flex flex-col items-center gap-1 pt-2">
              <span
                className="tnum leading-none"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 88,
                  fontWeight: 500,
                  color: "var(--saffron-deep)",
                  letterSpacing: "-0.02em",
                }}
              >
                {ans.age}
              </span>
              <span className="text-[15px] font-medium" style={{ color: "var(--ink-3)" }}>
                years
              </span>
            </div>

            {/* Slider */}
            <div className="px-1">
              <input
                type="range" min={18} max={75} step={1}
                value={ans.age}
                onChange={(e) => setAns((a) => ({ ...a, age: Number(e.target.value) }))}
                className="saathi-slider"
                style={{
                  background: `linear-gradient(to right, var(--saffron) 0%, var(--saffron) ${pct}, var(--surface-3) ${pct}, var(--surface-3) 100%)`,
                }}
              />
              {/* Labels */}
              <div className="flex justify-between mt-3 px-0.5">
                {[18, 30, 45, 60, 75].map((v) => (
                  <span
                    key={v}
                    className="text-[11px] font-medium"
                    style={{ color: ans.age === v ? "var(--saffron-deep)" : "var(--ink-3)" }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      }

      /* Step 2 — Gender */
      case 2:
        return (
          <div className="flex gap-3">
            <BigCard emoji="👨" title="Male"
              selected={ans.gender === "Male"}
              onClick={() => setAns((a) => ({ ...a, gender: "Male" }))} />
            <BigCard emoji="👩" title="Female"
              selected={ans.gender === "Female"}
              onClick={() => setAns((a) => ({ ...a, gender: "Female" }))} />
          </div>
        );

      /* Step 3 — Monthly income */
      case 3: {
        const pct = trackPct(ans.income, 10000, 500000);
        return (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-1 pt-2">
              <span
                className="tnum leading-none"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 64,
                  fontWeight: 500,
                  color: "var(--saffron-deep)",
                  letterSpacing: "-0.02em",
                }}
              >
                {fmtRupee(ans.income)}
              </span>
              <span className="text-[15px] font-medium" style={{ color: "var(--ink-3)" }}>
                per month
              </span>
            </div>
            <div className="px-1">
              <input
                type="range" min={10000} max={500000} step={5000}
                value={ans.income}
                onChange={(e) => setAns((a) => ({ ...a, income: Number(e.target.value) }))}
                className="saathi-slider"
                style={{
                  background: `linear-gradient(to right, var(--saffron) 0%, var(--saffron) ${pct}, var(--surface-3) ${pct}, var(--surface-3) 100%)`,
                }}
              />
              <div className="flex justify-between mt-3 px-0.5">
                {["₹10K", "₹1L", "₹2L", "₹3L", "₹5L+"].map((v) => (
                  <span key={v} className="text-[11px] font-medium" style={{ color: "var(--ink-3)" }}>{v}</span>
                ))}
              </div>
            </div>
          </div>
        );
      }

      /* Step 4 — Dependents */
      case 4:
        return (
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: "Spouse / partner",  emoji: "💑", sub: "Primary breadwinner"    },
              { id: "1 child",           emoji: "👶", sub: "Under 18 years"          },
              { id: "2+ children",       emoji: "👨‍👧‍👦", sub: "Under 18 years"         },
              { id: "Dependent parents", emoji: "👴", sub: "No independent income"   },
              { id: "No dependents yet", emoji: "🧑", sub: "Planning ahead"          },
            ].map((d) => (
              <Chip key={d.id} label={d.id} sub={d.sub} emoji={d.emoji}
                selected={ans.dependents.includes(d.id)}
                onClick={() => toggleDep(d.id)} multi />
            ))}
          </div>
        );

      /* Step 5 — Loans */
      case 5: {
        const hasLoan = ans.loans > 0;
        const pct     = trackPct(ans.loans, 0, 10000000);
        return (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2.5">
              <Chip label="✨  Debt free" selected={!hasLoan}
                onClick={() => setAns((a) => ({ ...a, loans: 0 }))} />
              <Chip label="🏠  Yes, I have loans" selected={hasLoan}
                onClick={() => setAns((a) => ({ ...a, loans: a.loans > 0 ? a.loans : 2800000 }))} />
            </div>
            {hasLoan && (
              <div
                className="p-4 rounded-[18px] flex flex-col gap-4"
                style={{ background: "var(--surface)", border: "1px solid var(--hairline)" }}
              >
                <div className="flex flex-col items-center gap-1">
                  <span
                    className="tnum leading-none"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 52,
                      fontWeight: 500,
                      color: "var(--saffron-deep)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {fmtRupee(ans.loans)}
                  </span>
                  <span className="text-[13px]" style={{ color: "var(--ink-3)" }}>total outstanding</span>
                </div>
                <input
                  type="range" min={100000} max={10000000} step={100000}
                  value={ans.loans}
                  onChange={(e) => setAns((a) => ({ ...a, loans: Number(e.target.value) }))}
                  className="saathi-slider"
                  style={{
                    background: `linear-gradient(to right, var(--saffron) 0%, var(--saffron) ${pct}, var(--surface-3) ${pct}, var(--surface-3) 100%)`,
                  }}
                />
                <div className="flex justify-between">
                  {["₹1L", "₹25L", "₹50L", "₹75L", "₹1Cr+"].map((v) => (
                    <span key={v} className="text-[11px]" style={{ color: "var(--ink-3)" }}>{v}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }

      /* Step 6 — Health */
      case 6:
        return (
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: "Healthy",             emoji: "💪", sub: "No major conditions"     },
              { id: "Diabetes",            emoji: "🩸", sub: "Type 1 or Type 2"        },
              { id: "Blood pressure",      emoji: "💊", sub: "Hypertension, controlled" },
              { id: "Heart condition",     emoji: "❤️", sub: "Past or current"          },
              { id: "Other condition",     emoji: "🏥", sub: "Cancer, kidney, etc."     },
              { id: "Multiple conditions", emoji: "📋", sub: ""                         },
            ].map((h) => (
              <Chip key={h.id} label={h.id} sub={h.sub} emoji={h.emoji}
                selected={ans.health === h.id}
                onClick={() => setAns((a) => ({ ...a, health: h.id }))} />
            ))}
          </div>
        );

      /* Step 7 — Existing cover */
      case 7:
        return (
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: "No cover at all", emoji: "0️⃣", sub: ""                   },
              { id: "Under ₹25L",      emoji: "🔒", sub: "Employer basic only" },
              { id: "₹25L – ₹1Cr",    emoji: "🛡️", sub: ""                   },
              { id: "₹1Cr+",           emoji: "💎", sub: ""                   },
            ].map((c) => (
              <Chip key={c.id} label={c.id} sub={c.sub} emoji={c.emoji}
                selected={ans.existingCover === c.id}
                onClick={() => setAns((a) => ({ ...a, existingCover: c.id }))} />
            ))}
          </div>
        );

      /* Step 8 — City */
      case 8:
        return (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={ans.city}
              onChange={(e) => setAns((a) => ({ ...a, city: e.target.value }))}
              placeholder="e.g. Jaipur, Mumbai, Bengaluru…"
              className="w-full h-[54px] rounded-[14px] px-4 text-[15px] font-medium text-ink placeholder:text-muted-2 outline-none transition-all"
              style={{
                background: "var(--surface)",
                border: `1.5px solid ${ans.city.length >= 2 ? "var(--saffron)" : "var(--hairline)"}`,
                boxShadow: ans.city.length >= 2 ? "0 0 0 1px var(--saffron)" : "none",
              }}
            />
            {/* Popular cities */}
            <div className="flex flex-wrap gap-2 mt-1">
              {["Delhi", "Mumbai", "Bengaluru", "Jaipur", "Hyderabad", "Chennai"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setAns((a) => ({ ...a, city: c }))}
                  className="px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all"
                  style={{
                    background: ans.city === c ? "var(--tint-saffron)" : "var(--surface)",
                    border: `1px solid ${ans.city === c ? "var(--saffron)" : "var(--hairline)"}`,
                    color: ans.city === c ? "var(--saffron-deep)" : "var(--ink-3)",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        );

      /* Step 9 — Financial goals */
      case 9:
        return (
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: "Travel",           emoji: "✈️",  sub: "International or domestic trip"  },
              { id: "Buy a car",        emoji: "🚗",  sub: "New or used vehicle"              },
              { id: "Own a home",       emoji: "🏠",  sub: "Down payment & home loan"         },
              { id: "Start a business", emoji: "💡",  sub: "Startup or side venture"          },
              { id: "Marriage",         emoji: "💍",  sub: "Your own or child's wedding"       },
              { id: "Child education",  emoji: "🎓",  sub: "School, college or abroad"        },
              { id: "Early retirement", emoji: "🌅",  sub: "Financial freedom before 55"      },
              { id: "Health buffer",    emoji: "🏥",  sub: "Medical & elder care fund"        },
            ].map((g) => (
              <Chip key={g.id} label={g.id} sub={g.sub} emoji={g.emoji}
                selected={ans.goals.includes(g.id)}
                onClick={() => toggleGoal(g.id)} multi />
            ))}
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div
      className="flex flex-col"
      style={{ minHeight: "100dvh", background: "var(--bg-app)" }}
    >
      {/* ── Top bar ────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-3 px-5 pt-5 pb-4">
        {/* Back */}
        <button
          type="button"
          onClick={back}
          className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 transition-colors"
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--hairline)",
            boxShadow: "0 1px 4px rgba(28,24,18,0.08)",
          }}
        >
          <ChevronLeft size={18} strokeWidth={2} style={{ color: "var(--ink-2)" }} />
        </button>

        {/* Progress dots + counter */}
        <div className="flex-1 flex items-center gap-2.5">
          <div className="flex gap-1.5 flex-1">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-[4px] rounded-full transition-all duration-300"
                style={{
                  background: i < step
                    ? "var(--saffron)"
                    : "var(--surface-3)",
                }}
              />
            ))}
          </div>
          <span
            className="shrink-0 text-[12px] font-bold tnum"
            style={{ color: "var(--ink-3)" }}
          >
            {step}/{TOTAL_STEPS}
          </span>
        </div>
      </div>

      {/* ── Scrollable content ─────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">

        {/* Saathi eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <Logo size={28} />
          <span
            className="text-[11px] font-bold tracking-[0.1em] uppercase"
            style={{ color: "var(--saffron-deep)" }}
          >
            Saathi · Let&apos;s start easy
          </span>
        </div>

        {/* Question heading */}
        <h2
          className="leading-[1.1] mb-2"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 7vw, 36px)",
            fontWeight: 500,
            color: "var(--ink)",
            letterSpacing: "-0.01em",
          }}
        >
          {headline}
        </h2>

        {/* Subtitle */}
        <p className="text-[13px] mb-6 leading-[1.5]" style={{ color: "var(--ink-3)" }}>
          {sub}
        </p>

        {/* Step body */}
        {renderBody()}

        {/* Saathi insight */}
        {insight && (
          <div className="flex gap-3 items-start mt-6 p-4 rounded-[16px]"
            style={{ background: "var(--surface-2)" }}>
            <Sparkles
              size={16}
              strokeWidth={2}
              className="shrink-0 mt-0.5"
              style={{ color: "var(--saffron)" }}
            />
            <p className="text-[13px] leading-[1.5]" style={{ color: "var(--ink-2)" }}
              dangerouslySetInnerHTML={{ __html: insight.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
            />
          </div>
        )}
      </div>

      {/* ── Continue button ─────────────────────────── */}
      <div
        className="shrink-0 px-5 pb-8 pt-3"
        style={{ paddingBottom: "max(32px, env(safe-area-inset-bottom))" }}
      >
        <button
          type="button"
          onClick={next}
          disabled={!valid}
          className="flex items-center justify-center gap-2 w-full h-[54px] rounded-[14px] text-[15px] font-semibold transition-all"
          style={{
            background: valid ? "var(--saffron)" : "var(--surface-3)",
            color:      valid ? "#fff8ef"         : "var(--ink-3)",
            boxShadow:  valid
              ? "0 1px 0 rgba(255,255,255,0.25) inset, 0 2px 12px rgba(168,85,34,0.3)"
              : "none",
            cursor: valid ? "pointer" : "not-allowed",
          }}
        >
          {step === TOTAL_STEPS ? "Build my plan →" : "Continue"}
          <ChevronRight size={18} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

export default function QuestionsPage() {
  return (
    <Suspense>
      <QuestionsForm />
    </Suspense>
  );
}
