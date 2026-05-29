"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Info, CreditCard, TrendingUp, BarChart2,
  Flag, Shield, Wallet, Target, Zap, ChevronRight,
} from "lucide-react";
import { Logo }   from "@/components/shared/Logo";
import { Pill }   from "@/components/shared/Pill";
import { FSCard } from "@/components/shared/FSCard";

/* ── All 8 insights ─────────────────────────────────── */
const ALL_INSIGHTS = [
  /* ─ FEATURED ─ high-value, shown first in horizontal strip */
  {
    id:       "cashback",
    featured: true,
    kind:     "cashback",
    category: "Spend",
    tone:     "saffron",
    bg:       "var(--tint-saffron)",
    fg:       "var(--saffron-deep)",
    iconBg:   "var(--saffron)",
    eyebrow:  "SPENDING PATTERN",
    when:     "2h ago",
    live:     true,
    headline: "₹38K/mo UPI earns you ₹0",
    sub:      "A cashback card pays ₹570 back/mo. CIBIL 724 already pre-qualifies you.",
    saved:    "₹6,800",
    valueLabel: "EST. VALUE / YR",
    sources:  ["AA · 6mo statements", "Chat · UPI confirmed", "CIBIL 724"],
    cta:      "See the math",
    Icon:     CreditCard,
  },
  {
    id:       "pooja-term",
    featured: true,
    kind:     "protect",
    category: "Urgent",
    tone:     "rose",
    bg:       "#fde8e4",
    fg:       "var(--bad)",
    iconBg:   "var(--bad)",
    eyebrow:  "FAMILY PROTECTION",
    when:     "Today",
    live:     true,
    headline: "Pooja has zero insurance",
    sub:      "Wife, homemaker, age 26. ₹50L term available at just ₹390/mo. Takes 10 minutes to apply.",
    saved:    "₹50L cover",
    valueLabel: "PROTECTION VALUE",
    sources:  ["Family profile · Pooja", "HDFC life · best rate"],
    cta:      "View plan",
    Icon:     Shield,
  },
  {
    id:       "liquid-fund",
    featured: true,
    kind:     "sip",
    category: "Invest",
    tone:     "good",
    bg:       "var(--tint-green)",
    fg:       "var(--good-deep)",
    iconBg:   "var(--good)",
    eyebrow:  "IDLE MONEY",
    when:     "Yesterday",
    live:     false,
    headline: "₹2.4L earning only 3.5%",
    sub:      "Move ₹1.6L to a liquid fund. Same next-day access, 7.1% return. Extra ₹5,760/yr.",
    saved:    "₹5,760",
    valueLabel: "EST. VALUE / YR",
    sources:  ["AA · HDFC savings balance", "Emergency fund already met"],
    cta:      "See the move",
    Icon:     TrendingUp,
  },

  /* ─ NON-FEATURED ─ full list below ─ */
  {
    id:       "elss-topup",
    featured: false,
    kind:     "tax",
    category: "Tax",
    tone:     "indigo",
    bg:       "var(--tint-indigo)",
    fg:       "var(--indigo)",
    iconBg:   "var(--indigo)",
    eyebrow:  "TAX SAVING",
    when:     "3 days ago",
    live:     false,
    headline: "₹12,000 of 80C room left",
    sub:      "You've used ₹1.38L of the ₹1.5L limit. Top up your ELSS SIP by ₹1K/mo to fill the gap and save ₹3,700 in tax.",
    saved:    "₹3,700",
    valueLabel: "TAX SAVED / YR",
    sources:  ["Form 16 · FY 2025-26", "ELSS · Parag Parikh fund"],
    cta:      "Top up SIP",
    Icon:     Target,
  },
  {
    id:       "rebalance",
    featured: false,
    kind:     "rebalance",
    category: "Invest",
    tone:     "indigo",
    bg:       "var(--tint-indigo)",
    fg:       "var(--indigo)",
    iconBg:   "var(--indigo)",
    eyebrow:  "PORTFOLIO DRIFT",
    when:     "3 days ago",
    live:     false,
    headline: "SIP is 73% small-cap — too risky",
    sub:      "Suggested rebalance to 50/30/20 large/mid/small. Same return profile, much lower volatility.",
    saved:    "Stability",
    valueLabel: "RISK REDUCED",
    sources:  ["Groww · 3 funds", "Goal · retirement at 60"],
    cta:      "Show rebalance",
    Icon:     BarChart2,
  },
  {
    id:       "emergency-fund",
    featured: false,
    kind:     "protect",
    category: "Urgent",
    tone:     "amber",
    bg:       "var(--tint-amber)",
    fg:       "#6e4f0a",
    iconBg:   "var(--caution)",
    eyebrow:  "EMERGENCY FUND",
    when:     "This week",
    live:     false,
    headline: "Only 3.1 months of runway",
    sub:      "You need 6 months of expenses (₹4L). Currently ₹78K saved. Add ₹12K/mo for 4 months to hit the target.",
    saved:    "Peace of mind",
    valueLabel: "MONTHS RUNWAY NEEDED",
    sources:  ["AA · savings balance", "Monthly expenses ₹51K"],
    cta:      "Build fund",
    Icon:     Wallet,
  },
  {
    id:       "prepay",
    featured: false,
    kind:     "prepay",
    category: "Debt",
    tone:     "amber",
    bg:       "var(--tint-amber)",
    fg:       "#6e4f0a",
    iconBg:   "var(--caution)",
    eyebrow:  "ANNUAL BONUS",
    when:     "1 week ago",
    live:     false,
    headline: "Use ₹85K bonus to prepay home loan",
    sub:      "Saves ₹38K in interest vs investing it at 11.6%. Marginal call — here's the full comparison.",
    saved:    "₹38,000",
    valueLabel: "INTEREST SAVED",
    sources:  ["AA · ₹85K credit Mar 31", "SBI home loan at 8.65%"],
    cta:      "Compare options",
    Icon:     Flag,
  },
  {
    id:       "nps-switch",
    featured: false,
    kind:     "tax",
    category: "Tax",
    tone:     "good",
    bg:       "var(--tint-green)",
    fg:       "var(--good-deep)",
    iconBg:   "var(--good)",
    eyebrow:  "NPS OPPORTUNITY",
    when:     "2 weeks ago",
    live:     false,
    headline: "NPS saves ₹8,500/yr more than PPF",
    sub:      "You contribute ₹500/mo to PPF. Switching to NPS Tier-1 unlocks ₹50K extra 80CCD(1B) deduction. Your tax bracket saves ₹8.5K.",
    saved:    "₹8,500",
    valueLabel: "EXTRA TAX SAVED / YR",
    sources:  ["PPF statement · ₹500/mo", "New tax regime · 20% slab"],
    cta:      "Explore NPS",
    Icon:     Zap,
  },
] as const;

type Category = "All" | "Urgent" | "Invest" | "Tax" | "Spend" | "Debt";
const FILTERS: Category[] = ["All", "Urgent", "Invest", "Tax", "Spend", "Debt"];

const TOTAL_VALUE = "₹1.07L";

export default function InsightsFeedPage() {
  const [activeFilter, setActiveFilter] = useState<Category>("All");

  const featured = ALL_INSIGHTS.filter((i) => i.featured);
  const allList  = activeFilter === "All"
    ? ALL_INSIGHTS
    : ALL_INSIGHTS.filter((i) => i.category === activeFilter);

  const urgentCount = ALL_INSIGHTS.filter(i => i.category === "Urgent").length;

  return (
    <div className="min-h-full pb-6" style={{ background: "var(--surface-2)" }}>

      {/* ── Sticky header ──────────────────────────────── */}
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
            <div className="text-[16px] font-bold text-ink leading-tight">Saathi insights</div>
            <div className="text-[11px] font-medium" style={{ color: "var(--ink-3)" }}>
              8 opportunities · {TOTAL_VALUE} found
            </div>
          </div>
        </div>
        <Pill tone="ink" size="sm">{TOTAL_VALUE} found</Pill>
      </div>

      <div className="flex flex-col gap-4 pt-4">

        {/* ── Hero dark card ──────────────────────────────── */}
        <div className="px-4">
          <FSCard tone="ink" pad={18} className="relative overflow-hidden">
            <div
              className="absolute pointer-events-none rounded-full"
              style={{ right: -30, top: -30, width: 160, height: 160,
                background: "radial-gradient(circle, rgba(217,120,58,0.32), transparent 70%)" }}
            />
            <div className="relative flex items-center gap-3.5">
              <div className="relative shrink-0">
                <Logo size={44} />
                <span
                  className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full border-2"
                  style={{ background: "var(--good)", borderColor: "var(--ink)" }}
                />
              </div>
              <div>
                <div className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ color: "var(--saffron-soft)" }}>
                  Always watching · since Mar 2026
                </div>
                <div
                  className="text-[22px] font-medium mt-1 leading-[1.2]"
                  style={{ fontFamily: "var(--font-display)", color: "#fff8ef" }}
                >
                  I found{" "}
                  <em className="italic" style={{ color: "var(--saffron-soft)" }}>
                    {TOTAL_VALUE}/yr
                  </em>
                  <br />
                  you could keep.
                </div>
              </div>
            </div>
            <div
              className="mt-3.5 pt-3.5 flex gap-5 border-t"
              style={{ borderColor: "rgba(251,231,207,0.18)" }}
            >
              {([["3", "data sources"], ["18,420", "txns analysed"], ["92%", "confidence"]] as const).map(([v, l]) => (
                <div key={l} style={{ color: "rgba(251,231,207,0.75)" }}>
                  <span className="font-bold text-[14px]" style={{ color: "#fff8ef" }}>{v}</span>
                  <div className="text-[11px] mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </FSCard>
        </div>

        {/* ── Featured — horizontal swipeable ────────────── */}
        <div>
          <div className="flex items-center justify-between px-4 mb-3">
            <span className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ color: "var(--ink-3)" }}>
              Top picks · act now
            </span>
            {urgentCount > 0 && (
              <span className="text-[11px] font-bold" style={{ color: "var(--bad)" }}>
                {urgentCount} urgent
              </span>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide snap-x snap-mandatory">
            {featured.map((ins) => (
              <Link
                key={ins.id}
                href={`/insights/${ins.id}`}
                className="shrink-0 snap-start flex flex-col rounded-[20px] overflow-hidden active:scale-[0.98] transition-transform"
                style={{
                  width: "calc(100vw - 80px)",
                  maxWidth: 290,
                  background: ins.bg,
                  border: ins.live ? `1.5px solid ${ins.fg}` : "1px solid rgba(0,0,0,0.06)",
                  padding: 16,
                }}
              >
                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                  <span
                    className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
                    style={{ background: ins.iconBg }}
                  >
                    <ins.Icon size={20} strokeWidth={2} color="#fff" />
                  </span>
                  <div className="flex items-center gap-1.5">
                    {ins.live && (
                      <span
                        className="text-[9px] font-extrabold tracking-[0.06em] px-1.5 py-0.5 rounded-full"
                        style={{ background: ins.fg, color: "#fff8ef" }}
                      >
                        LIVE
                      </span>
                    )}
                    <span className="text-[10px] font-semibold" style={{ color: ins.fg, opacity: 0.7 }}>
                      {ins.when}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] font-extrabold tracking-[0.1em]" style={{ color: ins.fg }}>
                  {ins.eyebrow}
                </div>
                <div
                  className="mt-1 text-[18px] font-medium leading-[1.2]"
                  style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
                >
                  <em className="italic">{ins.headline.split(" ").slice(0, 2).join(" ")}</em>{" "}
                  {ins.headline.split(" ").slice(2).join(" ")}
                </div>
                <p className="text-[12px] mt-1.5 leading-[1.45]" style={{ color: "var(--ink-2)" }}>
                  {ins.sub}
                </p>

                {/* Value */}
                <div className="mt-3">
                  <div className="text-[9px] font-bold tracking-[0.08em]" style={{ color: ins.fg, opacity: 0.7 }}>
                    {ins.valueLabel}
                  </div>
                  <div className="tnum text-[22px] font-medium mt-0.5"
                    style={{ fontFamily: "var(--font-display)", color: ins.fg }}>
                    {ins.saved}
                  </div>
                </div>

                {/* Sources */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {ins.sources.map((s) => (
                    <span key={s}
                      className="inline-flex items-center gap-1 px-2 py-[3px] rounded-[6px] text-[10px] font-semibold"
                      style={{ background: "rgba(255,255,255,0.55)", color: "var(--ink-2)", border: "1px solid rgba(255,255,255,0.4)" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--good)" }} />
                      {s}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-3">
                  <span
                    className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-[12px] text-[13px] font-bold"
                    style={{ background: "rgba(255,255,255,0.65)", color: ins.fg }}
                  >
                    {ins.cta} <ChevronRight size={13} strokeWidth={2.5} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Filter chips ────────────────────────────────── */}
        <div className="flex gap-1.5 overflow-x-auto px-4 scrollbar-hide">
          {FILTERS.map((f) => {
            const cnt = f === "All" ? ALL_INSIGHTS.length : ALL_INSIGHTS.filter(i => i.category === f).length;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="shrink-0 px-3 py-1.5 rounded-full text-[12px] font-bold transition-all"
                style={{
                  background: activeFilter === f ? "var(--ink)" : "var(--surface)",
                  color: activeFilter === f ? "#fff8ef" : "var(--ink-2)",
                  border: activeFilter === f ? "none" : "1px solid var(--hairline)",
                }}
              >
                {f} {cnt > 0 && <span style={{ opacity: 0.6 }}>{cnt}</span>}
              </button>
            );
          })}
        </div>

        {/* ── Full list ────────────────────────────────────── */}
        <div className="px-4 flex flex-col gap-3">
          {allList.map((ins) => (
            <Link key={ins.id} href={`/insights/${ins.id}`}>
              <FSCard
                tone="white"
                pad={16}
                className="active:scale-[0.99] transition-transform"
                style={ins.live ? { border: `1.5px solid ${ins.fg}` } : undefined}
              >
                <div className="flex gap-3 items-start">
                  <span
                    className="w-[38px] h-[38px] rounded-[11px] shrink-0 flex items-center justify-center"
                    style={{ background: ins.bg }}
                  >
                    <ins.Icon size={19} strokeWidth={2} style={{ color: ins.fg }} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] font-bold tracking-[0.08em] uppercase" style={{ color: ins.fg }}>
                        {ins.eyebrow}
                      </span>
                      <span className="text-[10px] font-semibold shrink-0" style={{ color: "var(--ink-3)" }}>
                        {ins.when}
                      </span>
                    </div>
                    <div
                      className="text-[16px] font-medium text-ink mt-1 leading-[1.25]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {ins.headline}
                    </div>
                    <p className="text-[12px] mt-1.5 leading-[1.5]" style={{ color: "var(--ink-3)" }}>
                      {ins.sub}
                    </p>
                  </div>
                </div>

                {/* Source strip */}
                <div className="mt-3 p-2.5 rounded-[10px]" style={{ background: "var(--surface-2)" }}>
                  <div className="text-[9px] font-bold tracking-[0.08em] uppercase mb-1.5" style={{ color: "var(--ink-3)" }}>
                    Saathi cross-referenced
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {ins.sources.map((s) => (
                      <span key={s}
                        className="inline-flex items-center gap-1 px-2 py-[3px] rounded-[6px] text-[10px] font-semibold border border-hairline bg-surface"
                        style={{ color: "var(--ink-2)" }}
                      >
                        <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "var(--good)" }} />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div>
                    <div className="text-[9px] font-bold tracking-[0.06em]" style={{ color: "var(--ink-3)" }}>
                      {ins.valueLabel}
                    </div>
                    <div className="tnum text-[20px] font-medium mt-0.5"
                      style={{ fontFamily: "var(--font-display)", color: ins.fg }}>
                      {ins.saved}
                    </div>
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-[12px] text-[13px] font-bold"
                    style={ins.live
                      ? { background: ins.fg, color: "#fff8ef" }
                      : { border: "1.5px solid var(--hairline)", color: "var(--ink)" }}
                  >
                    {ins.cta} <ChevronRight size={13} strokeWidth={2.5} />
                  </span>
                </div>
              </FSCard>
            </Link>
          ))}
        </div>

        {/* ── Info note ───────────────────────────────────── */}
        <div className="px-4">
          <div className="p-3.5 rounded-[14px] flex gap-2.5 items-start" style={{ background: "var(--tint-indigo)" }}>
            <Info size={16} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: "var(--indigo)" }} />
            <p className="text-[12px] leading-[1.5]" style={{ color: "var(--indigo)" }}>
              New insights appear when Saathi has <strong>≥80% confidence</strong> and finds{" "}
              <strong>≥₹500/yr</strong> of value. You&apos;ll never get spammy nudges.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
