import Link from "next/link";
import { ChevronLeft, ChevronRight, Check, Clock, AlertCircle } from "lucide-react";
import { AppHeader } from "@/components/chrome/AppHeader";
import { IconBtn }   from "@/components/shared/IconBtn";
import { FSCard }    from "@/components/shared/FSCard";
import { Pill }      from "@/components/shared/Pill";
import { pooja, rahul } from "@/lib/personas";

// Projected CIBIL milestones for Pooja
const MILESTONES = [
  { label: "Now",    score: 0,   note: "No file"    },
  { label: "3 mo",  score: 580,  note: "File opened" },
  { label: "6 mo",  score: 628,  note: "Fair"        },
  { label: "12 mo", score: 672,  note: "Good start"  },
  { label: "24 mo", score: pooja.cibilTarget, note: "Target" },
];

const STEPS = [
  {
    id:       "au-card",
    title:    `Add Pooja as authorised user on Rahul's HDFC card`,
    detail:   "Pooja gets a card linked to Rahul's account. His 3-year history instantly reflects on her new CIBIL file. Zero cost, done in 10 minutes online.",
    impact:   "Opens credit file · immediate 580 score",
    timeframe: "Today",
    effort:   "10 min",
    urgent:   true,
  },
  {
    id:       "usage",
    title:    "Use the card for ₹3,000–₹5,000/mo of household purchases",
    detail:   "Groceries, fuel, utilities — low usage builds history. Keep utilisation below 10% (₹18,000 limit on AU card).",
    impact:   "+40–50 pts in 3 months",
    timeframe: "Ongoing",
    effort:   "Automatic",
    urgent:   false,
  },
  {
    id:       "own-card",
    title:    "Apply for her own credit card at 6 months",
    detail:   "Once CIBIL hits 620+, she qualifies for a secured credit card (FD-backed, ₹25,000 limit). This builds independent history.",
    impact:   "Score independence from Rahul",
    timeframe: "Nov 2026",
    effort:   "20 min",
    urgent:   false,
  },
  {
    id:       "ppf-credit",
    title:    "Link PPF as financial proof",
    detail:   "PPF account documents show consistent savings discipline to lenders — strengthens any future loan application.",
    impact:   "Loan eligibility for future",
    timeframe: "When applying for loans",
    effort:   "Document ready",
    urgent:   false,
  },
];

const MYTHS = [
  {
    myth: "Homemakers can't build credit",
    fact: "Any adult can have a CIBIL score — income is not required to open a credit file.",
  },
  {
    myth: "She needs her own income first",
    fact: "Authorised user status, FD-backed cards, and joint accounts all work without independent income.",
  },
  {
    myth: "Building credit takes 5+ years",
    fact: "With the AU card strategy, Pooja can reach 650+ in 6 months and hit the target 740 by Feb 2027.",
  },
];

export default function PoojasCreditPage() {
  return (
    <div className="pb-10">
      <AppHeader
        title="Pooja's Credit"
        subtitle={`No file today → ${pooja.cibilTarget} by ${pooja.cibilTargetBy}`}
        leading={
          <Link href="/family/pooja">
            <IconBtn aria-label="Back"><ChevronLeft size={18} /></IconBtn>
          </Link>
        }
        bg="var(--bg-app)"
      />

      <div className="px-[18px] flex flex-col gap-3">

        {/* Current state hero */}
        <div
          className="p-4 rounded-[20px]"
          style={{ background: "var(--ink)", color: "#fff8ef" }}
        >
          <div className="eyebrow mb-2" style={{ color: "rgba(255,248,239,0.55)" }}>
            CIBIL score today
          </div>
          <div className="flex items-baseline gap-3">
            <span
              className="tnum text-[52px] font-bold leading-none"
              style={{ fontFamily: "var(--font-display)", color: "var(--bad)" }}
            >
              —
            </span>
            <div>
              <Pill tone="rose" size="sm">Invisible file</Pill>
              <div className="text-[11px] mt-1.5" style={{ color: "rgba(255,248,239,0.5)" }}>
                No credit history exists for Pooja
              </div>
            </div>
          </div>

          {/* Target */}
          <div
            className="mt-4 flex items-center justify-between p-3 rounded-[12px]"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <div>
              <div className="text-[10px]" style={{ color: "rgba(255,248,239,0.45)" }}>Target</div>
              <div
                className="tnum text-[22px] font-bold"
                style={{ color: "var(--good)", fontFamily: "var(--font-display)" }}
              >
                {pooja.cibilTarget}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px]" style={{ color: "rgba(255,248,239,0.45)" }}>Timeline</div>
              <div className="text-[14px] font-bold" style={{ color: "#fff8ef" }}>
                {pooja.cibilTargetBy}
              </div>
            </div>
            <div>
              <div className="text-[10px]" style={{ color: "rgba(255,248,239,0.45)" }}>Tier</div>
              <div className="text-[14px] font-bold" style={{ color: "#fff8ef" }}>Good</div>
            </div>
          </div>
        </div>

        {/* Projected timeline */}
        <FSCard tone="cream" pad={16}>
          <div className="eyebrow mb-3">Projected trajectory</div>
          <div className="relative">
            {/* Track line */}
            <div
              className="absolute top-[10px] left-[10px] right-[10px] h-[2px]"
              style={{ background: "var(--surface-3)" }}
            />
            <div className="flex justify-between relative">
              {MILESTONES.map((m, i) => (
                <div key={m.label} className="flex flex-col items-center" style={{ width: 52 }}>
                  <div
                    className="w-5 h-5 rounded-full z-10 flex items-center justify-center"
                    style={{
                      background: m.score === 0 ? "var(--bad)"
                        : m.score >= pooja.cibilTarget ? "var(--good)"
                        : "var(--caution)",
                    }}
                  >
                    {m.score >= pooja.cibilTarget && (
                      <Check size={10} strokeWidth={3} style={{ color: "#fff" }} />
                    )}
                  </div>
                  <div
                    className="tnum text-[13px] font-bold mt-1.5"
                    style={{
                      color: m.score === 0 ? "var(--bad)"
                        : m.score >= pooja.cibilTarget ? "var(--good)"
                        : "var(--ink)",
                    }}
                  >
                    {m.score === 0 ? "—" : m.score}
                  </div>
                  <div className="text-[9px] text-muted mt-0.5 text-center">{m.label}</div>
                  <div className="text-[9px] text-center mt-0.5" style={{ color: "var(--saffron-deep)" }}>
                    {m.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FSCard>

        {/* Step-by-step plan */}
        <div className="eyebrow px-1 pt-1 pb-0.5">The plan · 4 steps</div>

        {STEPS.map((step, i) => (
          <div
            key={step.id}
            className="p-4 rounded-[16px] border"
            style={{
              background: "var(--surface)",
              borderColor: step.urgent ? "rgba(217,120,58,0.35)" : "var(--hairline)",
            }}
          >
            <div className="flex items-start gap-3">
              <span
                className="w-7 h-7 rounded-[8px] shrink-0 flex items-center justify-center font-extrabold text-[12px] mt-0.5"
                style={{
                  background: step.urgent ? "var(--saffron)" : "var(--surface-3)",
                  color: step.urgent ? "#fff8ef" : "var(--ink-2)",
                }}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold text-ink leading-[1.3]">
                  {step.title}
                </div>
                <p className="text-[12px] text-muted mt-1 leading-[1.45]">
                  {step.detail}
                </p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-[11px] font-bold" style={{ color: "var(--good)" }}>
                    {step.impact}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock size={10} style={{ color: "var(--muted)" }} />
                    <span className="text-[10px] text-muted">{step.timeframe}</span>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "var(--surface-3)", color: "var(--ink-2)" }}
                  >
                    {step.effort}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Myth busting */}
        <FSCard tone="white" pad={16}>
          <div className="eyebrow mb-3">Common myths — busted</div>
          {MYTHS.map((m, i) => (
            <div
              key={i}
              className="py-3 border-b border-hairline last:border-0"
            >
              <div className="flex items-start gap-2 mb-1">
                <AlertCircle size={13} strokeWidth={2} style={{ color: "var(--bad)", flexShrink: 0, marginTop: 1 }} />
                <span className="text-[12px] text-muted line-through">{m.myth}</span>
              </div>
              <div className="flex items-start gap-2 ml-1">
                <Check size={13} strokeWidth={2.5} style={{ color: "var(--good)", flexShrink: 0, marginTop: 1 }} />
                <span className="text-[12px] text-ink leading-[1.4]">{m.fact}</span>
              </div>
            </div>
          ))}
        </FSCard>

        {/* CTA — start with step 1 */}
        <div
          className="p-4 rounded-[16px]"
          style={{ background: "var(--tint-saffron)", border: "1px solid rgba(217,120,58,0.2)" }}
        >
          <div className="text-[14px] font-bold text-ink mb-1">Start today — 10 minutes</div>
          <p className="text-[12px] text-muted leading-[1.4] mb-3">
            Log into HDFC NetBanking → Credit Card → Add-on card → Pooja&apos;s details.
            Saathi can walk you through it step by step.
          </p>
          <div className="flex gap-2">
            <Link
              href="/saathi"
              className="flex-1 flex items-center justify-center gap-1.5 h-[42px] rounded-[12px] bg-saffron text-[#fff8ef] text-[13px] font-semibold"
              style={{ boxShadow: "0 1px 3px rgba(168,85,34,0.3)" }}
            >
              Ask Saathi
              <ChevronRight size={15} strokeWidth={2.4} />
            </Link>
            <button
              className="flex-1 flex items-center justify-center h-[42px] rounded-[12px] bg-surface border border-hairline text-[13px] font-semibold text-ink"
            >
              Do it myself
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
